import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");
const PACK_ROOT = path.join(ROOT, "data", "library");
const CONTENT_ID_PATTERN = /^[a-z0-9]+(?:[-_.:][a-z0-9]+)*$/;
const SCHEMA_ID_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const SEMANTIC_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

function assertLocalizedText(value) {
    assert.equal(typeof value, "object");
    assert.ok(value && !Array.isArray(value));
    assert.ok(Object.keys(value).length > 0);
    for (const [locale, text] of Object.entries(value)) {
        assert.deepEqual(Intl.getCanonicalLocales(locale), [locale]);
        assert.ok(text.trim());
    }
}

function fieldValueMatchesType(value, type) {
    if (type === "integer") return Number.isSafeInteger(value);
    if (type === "number")
        return typeof value === "number" && Number.isFinite(value);
    if (type === "string" || type === "asset" || type === "audio")
        return typeof value === "string";
    if (type === "boolean") return typeof value === "boolean";
    if (type === "stringList") {
        return (
            Array.isArray(value) &&
            value.every((item) => typeof item === "string")
        );
    }
    if (type === "localizedText") {
        try {
            assertLocalizedText(value);
            return true;
        } catch {
            return false;
        }
    }
    return false;
}

function readJson(filePath) {
    return JSON.parse(readFileSync(filePath, "utf8"));
}

function loadPack() {
    const manifest = readJson(path.join(PACK_ROOT, "manifest.json"));
    const schema = readJson(path.join(PACK_ROOT, manifest.schema));
    const records = [];
    for (const directory of readdirSync(
        path.join(PACK_ROOT, manifest.content),
        {
            withFileTypes: true,
        },
    ).filter((entry) => entry.isDirectory())) {
        for (const fileName of readdirSync(
            path.join(PACK_ROOT, manifest.content, directory.name),
        ).filter((name) => name.endsWith(".json"))) {
            for (const record of readJson(
                path.join(
                    PACK_ROOT,
                    manifest.content,
                    directory.name,
                    fileName,
                ),
            )) {
                records.push({ ...record, layer: directory.name });
            }
        }
    }
    return { manifest, schema, records };
}

test("declares a data-only Japanese Library content pack", () => {
    const { manifest, schema } = loadPack();
    assert.equal(manifest.id, "japanese-core");
    assert.equal(manifest.schema, "schema.json");
    assert.equal(manifest.content, "content");
    assert.match(manifest.id, CONTENT_ID_PATTERN);
    assert.match(manifest.namespace, SCHEMA_ID_PATTERN);
    assert.match(manifest.version, SEMANTIC_VERSION_PATTERN);
    assert.ok(manifest.publisher.trim());
    assert.ok(manifest.version.trim());
    assert.ok(manifest.contentRevision.trim());
    assert.ok(manifest.license.id);
    assert.equal(schema.id, manifest.id);
    assert.equal(schema.namespace, manifest.namespace);
    assert.equal(schema.language, "ja");
    assert.deepEqual(Intl.getCanonicalLocales(schema.language), ["ja"]);
    assertLocalizedText(schema.metadata.labels);
    assert.deepEqual(
        schema.layers.map(({ id }) => id),
        [
            "characters",
            "alt-characters",
            "definitions",
            "words",
            "particles",
            "sentences",
        ],
    );
    for (const layer of schema.layers) {
        assert.match(layer.id, SCHEMA_ID_PATTERN);
        assertLocalizedText(layer.metadata.labels);
        assert.ok(layer.semanticRole);
        for (const field of layer.fields ?? []) {
            assert.match(field.id, SCHEMA_ID_PATTERN);
            assertLocalizedText(field.metadata.labels);
            if (field.detail?.exclusive !== undefined) {
                assert.equal(typeof field.detail.exclusive, "boolean");
                assert.ok(field.detail.group);
            }
        }
        for (const relationship of layer.relationships ?? []) {
            assert.match(relationship.id, SCHEMA_ID_PATTERN);
            assertLocalizedText(relationship.metadata.labels);
            assert.ok(relationship.onDelete);
            if (relationship.requiredTarget) {
                assert.ok((relationship.minimum ?? 0) >= 1);
            }
        }
    }
});

test("definition records resolve through module-owned localized strings", () => {
    const { schema, records } = loadPack();
    const definitionLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "definition",
    );
    assert.ok(definitionLayer, "definition layer is required");
    assert.deepEqual(definitionLayer.definitionLocalization, {
        stringKeyPrefix: "japanese:definitions",
        stringKeyField: "string_key",
        translationsField: "translations",
    });
    const fieldsById = new Map(
        definitionLayer.fields.map((field) => [field.id, field]),
    );
    assert.equal(fieldsById.get("string_key")?.type, "string");
    assert.equal(fieldsById.get("translations")?.type, "localizedText");

    const definitions = records.filter(
        ({ layer }) => layer === definitionLayer.id,
    );
    assert.ok(definitions.length > 0, "preseeded definitions are required");
    for (const definition of definitions) {
        assert.match(
            definition.fields.string_key,
            /^japanese:definitions:[a-z0-9]+(?:[-_][a-z0-9]+)*$/,
        );
        assertLocalizedText(definition.fields.translations);
        assert.ok(definition.fields.translations.en.trim());
        for (const locale of ["de", "en", "id", "ja"]) {
            assert.ok(
                definition.fields.translations[locale]?.trim(),
                `${definition.id} requires a ${locale} translation`,
            );
        }
    }
});

test("content records satisfy schema fields and relationship targets", () => {
    const { schema, records } = loadPack();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    assert.equal(recordsById.size, records.length, "record IDs must be unique");
    const layersById = new Map(schema.layers.map((layer) => [layer.id, layer]));
    for (const record of records) {
        assert.equal(
            typeof record.id,
            "string",
            "content record ID must be a string",
        );
        assert.match(
            record.id,
            CONTENT_ID_PATTERN,
            `${record.id} is not a lowercase portable content record ID`,
        );
        assert.ok(
            record.id.startsWith(`${schema.namespace}:`),
            `${record.id} is outside the ${schema.namespace} namespace`,
        );
        assert.equal(
            typeof record.label,
            "string",
            `${record.id} requires a string label`,
        );
        assert.ok(record.label.trim(), `${record.id} requires a label`);
        const layer = layersById.get(record.layer);
        assert.ok(layer, `unknown layer ${record.layer}`);
        assertLocalizedText(layer.metadata.labels);
        const fieldsById = new Map(
            (layer.fields ?? []).map((field) => [field.id, field]),
        );
        for (const [fieldId, value] of Object.entries(record.fields ?? {})) {
            const field = fieldsById.get(fieldId);
            assert.ok(field, `${record.id} has unknown field ${fieldId}`);
            assertLocalizedText(field.metadata.labels);
            assert.equal(
                fieldValueMatchesType(value, field.type),
                true,
                `${record.id}.${fieldId}`,
            );
        }
        for (const field of layer.fields ?? []) {
            if (field.required)
                assert.notEqual(record.fields?.[field.id], undefined);
        }
        const relationshipsById = new Map(
            (layer.relationships ?? []).map((relation) => [
                relation.id,
                relation,
            ]),
        );
        for (const reference of record.references ?? []) {
            const relationship = relationshipsById.get(reference.relation);
            assert.ok(relationship, `${record.id} has unknown relationship`);
            assertLocalizedText(relationship.metadata.labels);
            assert.ok(
                relationship.onDelete,
                `${reference.relation} requires onDelete`,
            );
            if (relationship.ordered) {
                assert.ok(Number.isSafeInteger(reference.position));
                assert.ok(reference.position >= 0);
            } else {
                assert.equal(reference.position, undefined);
            }
            assert.equal(
                recordsById.get(reference.entryId)?.layer,
                relationship.targetLayer,
                `${record.id} has an invalid target`,
            );
        }
        for (const relationship of relationshipsById.values()) {
            const count = (record.references ?? []).filter(
                ({ relation }) => relation === relationship.id,
            ).length;
            assert.ok(count >= (relationship.minimum ?? 0));
            if (relationship.maximum !== undefined) {
                assert.ok(count <= relationship.maximum);
            }
        }
    }
});

test("writing units and sentence particles follow the current Library contract", () => {
    const { schema, records } = loadPack();
    const writingLayers = schema.layers.filter(({ semanticRole }) =>
        ["atomicWritingUnit", "compoundWritingUnit"].includes(semanticRole),
    );
    for (const layer of writingLayers) {
        const fields = new Map(layer.fields.map((field) => [field.id, field]));
        assert.equal(fields.get("pronunciation")?.type, "stringList");
        assert.equal(fields.get("pronunciation")?.required, true);
        assert.equal(fields.get("audio")?.type, "audio");
        assert.equal(fields.get("audio")?.required, true);
    }
    for (const record of records.filter(({ layer }) =>
        writingLayers.some(({ id }) => id === layer),
    )) {
        assert.ok(record.fields.pronunciation.length > 0);
        assert.match(record.fields.audio, /^https:\/\//);
    }
    const particleLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "particle",
    );
    assert.ok(particleLayer);
    const particles = records.filter(({ layer }) => layer === particleLayer.id);
    assert.ok(particles.length > 0);
    const sentence = records.find(({ layer }) => layer === "sentences");
    assert.ok(
        sentence.references.some(({ relation }) => relation === "particles"),
    );
});

test("content pack does not include binary files", () => {
    const binaryExtensions = new Set([
        ".aac",
        ".gif",
        ".jpeg",
        ".jpg",
        ".m4a",
        ".mp3",
        ".mp4",
        ".ogg",
        ".png",
        ".wav",
        ".webm",
    ]);
    const pending = [PACK_ROOT];
    while (pending.length) {
        const directory = pending.pop();
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const filePath = path.join(directory, entry.name);
            if (entry.isDirectory()) pending.push(filePath);
            else
                assert.equal(
                    binaryExtensions.has(path.extname(entry.name)),
                    false,
                );
        }
    }
});

test("recognized Library fields and definition relationships replace duplicate semantics", () => {
    const { schema, records } = loadPack();
    const forbiddenFields = new Set([
        "function",
        "language",
        "meaning",
        "reading",
        "readings",
        "romanization",
    ]);
    for (const layer of schema.layers) {
        for (const field of layer.fields ?? []) {
            assert.equal(
                forbiddenFields.has(field.id),
                false,
                `${layer.id}.${field.id} duplicates a Library semantic`,
            );
        }
    }
    const definitions = new Set(
        records
            .filter(({ layer }) => layer === "definitions")
            .map(({ id }) => id),
    );
    for (const layerId of ["alt-characters", "particles", "words"]) {
        const layer = schema.layers.find(({ id }) => id === layerId);
        assert.equal(
            layer.relationships.some(
                ({ id, targetLayer }) =>
                    id === "definitions" && targetLayer === "definitions",
            ),
            true,
        );
        for (const record of records.filter(({ layer }) => layer === layerId)) {
            const references = record.references.filter(
                ({ relation }) => relation === "definitions",
            );
            assert.ok(
                references.length > 0,
                `${record.id} requires a definition`,
            );
            for (const reference of references) {
                assert.equal(definitions.has(reference.entryId), true);
            }
        }
    }
});

test("kanji readings use kana labels and ordered character references", () => {
    const { schema, records } = loadPack();
    const compoundLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "compoundWritingUnit",
    );
    const readingRelationship = compoundLayer.relationships.find(
        ({ id }) => id === "readings",
    );
    assert.equal(readingRelationship.targetLayer, "characters");
    assert.equal(readingRelationship.ordered, true);
    assert.equal(readingRelationship.requiredTarget, true);
    assert.equal(
        compoundLayer.relationships.some(({ id }) => id === "components"),
        false,
    );

    const characters = new Map(
        records
            .filter(({ layer }) => layer === "characters")
            .map((record) => [record.id, record]),
    );
    for (const kanji of records.filter(
        ({ layer }) => layer === compoundLayer.id,
    )) {
        assert.ok(
            kanji.fields.pronunciation.every((reading) =>
                /^[\p{Script=Hiragana}ー]+$/u.test(reading),
            ),
            `${kanji.id} readings must be presented in kana`,
        );
        const readingLabels = kanji.references
            .filter(({ relation }) => relation === "readings")
            .sort((left, right) => left.position - right.position)
            .map(({ entryId }) => characters.get(entryId)?.label)
            .join("");
        assert.equal(readingLabels, kanji.fields.pronunciation.join(""));
        const readingTargets = kanji.references
            .filter(({ relation }) => relation === "readings")
            .map(({ entryId }) => characters.get(entryId));
        assert.ok(
            readingTargets.every(
                ({ fields }) => fields.character_class === "hiragana",
            ),
            `${kanji.id} reading references must link only to hiragana`,
        );
    }
});

test("character classes distinguish hiragana and katakana variations", () => {
    const { records } = loadPack();
    const characters = records.filter(({ layer }) => layer === "characters");
    const variations = characters.filter(
        ({ fields }) => fields.pronunciation[0] === "a",
    );
    assert.deepEqual(
        new Set(variations.map(({ fields }) => fields.character_class)),
        new Set(["hiragana", "katakana"]),
    );
    assert.deepEqual(
        new Set(variations.map(({ label }) => label)),
        new Set(["あ", "ア"]),
    );
});

test("badge filters use the current grouped exclusivity contract", () => {
    const { schema } = loadPack();
    const badgeFields = schema.layers.flatMap((layer) =>
        (layer.fields ?? []).filter(
            ({ detail }) => detail?.renderer === "badge",
        ),
    );
    assert.ok(badgeFields.length > 0);
    for (const field of badgeFields) {
        assert.equal(typeof field.detail.group, "string");
        assert.ok(field.detail.group.trim());
        assert.equal(field.detail.exclusive, true);
    }
});

test("tenten variants reference unvoiced parents within the same character class", () => {
    const { schema, records } = loadPack();
    const characterLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "atomicWritingUnit",
    );
    const variantRelationship = characterLayer.relationships.find(
        ({ id }) => id === "variant-of",
    );
    assert.deepEqual(
        {
            targetLayer: variantRelationship.targetLayer,
            maximum: variantRelationship.maximum,
            onDelete: variantRelationship.onDelete,
            resolverRole: variantRelationship.resolverRole,
            variantDirection: variantRelationship.variantDirection,
        },
        {
            targetLayer: "characters",
            maximum: 1,
            onDelete: "detach",
            resolverRole: undefined,
            variantDirection: "right",
        },
    );

    const characters = new Map(
        records
            .filter(({ layer }) => layer === characterLayer.id)
            .map((entry) => [entry.id, entry]),
    );
    const expectedVariants = new Map([
        ...[
            ["が", "か"],
            ["ぎ", "き"],
            ["ぐ", "く"],
            ["げ", "け"],
            ["ご", "こ"],
            ["ざ", "さ"],
            ["じ", "し"],
            ["ず", "す"],
            ["ぜ", "せ"],
            ["ぞ", "そ"],
            ["だ", "た"],
            ["ぢ", "ち"],
            ["づ", "つ"],
            ["で", "て"],
            ["ど", "と"],
            ["ば", "は"],
            ["び", "ひ"],
            ["ぶ", "ふ"],
            ["べ", "へ"],
            ["ぼ", "ほ"],
            ["ぱ", "は"],
            ["ぴ", "ひ"],
            ["ぷ", "ふ"],
            ["ぺ", "へ"],
            ["ぽ", "ほ"],
            ["ガ", "カ"],
            ["ギ", "キ"],
            ["グ", "ク"],
            ["ゲ", "ケ"],
            ["ゴ", "コ"],
            ["ザ", "サ"],
            ["ジ", "シ"],
            ["ズ", "ス"],
            ["ゼ", "セ"],
            ["ゾ", "ソ"],
            ["ダ", "タ"],
            ["ヂ", "チ"],
            ["ヅ", "ツ"],
            ["デ", "テ"],
            ["ド", "ト"],
            ["バ", "ハ"],
            ["ビ", "ヒ"],
            ["ブ", "フ"],
            ["ベ", "ヘ"],
            ["ボ", "ホ"],
            ["パ", "ハ"],
            ["ピ", "ヒ"],
            ["プ", "フ"],
            ["ペ", "ヘ"],
            ["ポ", "ホ"],
        ],
    ]);
    const variantChildren = [...characters.values()].filter((entry) =>
        (entry.references ?? []).some(
            ({ relation }) => relation === "variant-of",
        ),
    );
    assert.equal(variantChildren.length, expectedVariants.size);
    for (const child of variantChildren) {
        const references = child.references.filter(
            ({ relation }) => relation === "variant-of",
        );
        assert.equal(references.length, 1, `${child.id} requires one parent`);
        const parent = characters.get(references[0].entryId);
        assert.equal(parent?.label, expectedVariants.get(child.label));
        assert.equal(
            parent.fields.character_class,
            child.fields.character_class,
            `${child.id} must stay in its own character table`,
        );
    }
    for (const child of [...characters.values()].filter(({ label }) =>
        ["ア", "イ", "ウ", "エ", "オ"].includes(label),
    )) {
        assert.equal(child.references, undefined);
    }
});

test("directional variants remain separate from constituent resolvers", () => {
    const { schema } = loadPack();
    const characterLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "atomicWritingUnit",
    );
    const variantRelationship = characterLayer.relationships.find(
        ({ variantDirection }) => variantDirection,
    );
    assert.equal(variantRelationship.id, "variant-of");
    assert.equal(variantRelationship.resolverRole, undefined);

    const compoundLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "compoundWritingUnit",
    );
    assert.equal(
        compoundLayer.relationships.find(({ id }) => id === "readings")
            .resolverRole,
        "explicit",
    );
});

test("lexical and sentence pronunciation use the Library placement field", () => {
    const { schema, records } = loadPack();
    for (const semanticRole of ["lexicalUnit", "orderedLexicalSequence"]) {
        const layer = schema.layers.find(
            (candidate) => candidate.semanticRole === semanticRole,
        );
        const pronunciation = layer.fields.find(
            ({ id }) => id === "pronunciation",
        );
        assert.equal(pronunciation.type, "stringList");
        assert.equal(pronunciation.required, true);
        for (const record of records.filter(
            ({ layer: layerId }) => layerId === layer.id,
        )) {
            assert.ok(record.fields.pronunciation.length > 0);
        }
    }
});

test("definitions stay semantic while resolvers describe compositions", () => {
    const { schema } = loadPack();
    const definitionLayer = schema.layers.find(
        ({ semanticRole }) => semanticRole === "definition",
    );
    const definitionRelationships = schema.layers.flatMap((layer) =>
        (layer.relationships ?? []).filter(
            ({ targetLayer }) => targetLayer === definitionLayer.id,
        ),
    );
    assert.ok(definitionRelationships.length > 0);
    for (const relationship of definitionRelationships) {
        assert.equal(relationship.resolverRole, undefined);
    }

    const compositionRelationships = schema.layers.flatMap((layer) =>
        (layer.relationships ?? []).filter(({ resolverRole }) => resolverRole),
    );
    assert.deepEqual(
        new Set(
            compositionRelationships.map(
                ({ id, targetLayer }) => `${id}:${targetLayer}`,
            ),
        ),
        new Set([
            "readings:characters",
            "spelling:alt-characters",
            "words:words",
            "particles:particles",
        ]),
    );
});

test("required filter groups declare intentional defaults", () => {
    const { schema, records } = loadPack();
    for (const layer of schema.layers) {
        for (const field of layer.fields ?? []) {
            if (!field.detail?.required) continue;
            assert.equal(field.detail.exclusive, true);
            assert.ok(field.detail.group);
            assert.equal(typeof field.detail.defaultTag, "string");
            assert.ok(
                records.some(
                    (record) =>
                        record.layer === layer.id &&
                        record.fields?.[field.id] === field.detail.defaultTag,
                ),
                `${layer.id}.${field.id} default must exist in content`,
            );
        }
    }
});

test("hiragana and katakana include complete gojuon and voiced tables", () => {
    const { records } = loadPack();
    const characters = records.filter(({ layer }) => layer === "characters");
    const basePronunciations = [
        "a",
        "i",
        "u",
        "e",
        "o",
        "ka",
        "ki",
        "ku",
        "ke",
        "ko",
        "sa",
        "shi",
        "su",
        "se",
        "so",
        "ta",
        "chi",
        "tsu",
        "te",
        "to",
        "na",
        "ni",
        "nu",
        "ne",
        "no",
        "ha",
        "hi",
        "fu",
        "he",
        "ho",
        "ma",
        "mi",
        "mu",
        "me",
        "mo",
        "ya",
        "yu",
        "yo",
        "ra",
        "ri",
        "ru",
        "re",
        "ro",
        "wa",
        "wo",
        "n",
    ];
    for (const characterClass of ["hiragana", "katakana"]) {
        const table = characters.filter(
            ({ fields }) => fields.character_class === characterClass,
        );
        assert.equal(table.length, 71);
        const baseEntries = table.filter(
            (entry) => !(entry.references ?? []).length,
        );
        assert.equal(baseEntries.length, 46);
        assert.deepEqual(
            new Set(baseEntries.map(({ fields }) => fields.pronunciation[0])),
            new Set(basePronunciations),
        );
        const voicedEntries = table.filter(
            (entry) => (entry.references ?? []).length,
        );
        assert.equal(voicedEntries.length, 25);
        for (const variant of voicedEntries) {
            assert.equal(variant.references.length, 1);
            const parent = characters.find(
                ({ id }) => id === variant.references[0].entryId,
            );
            assert.equal(parent.fields.character_class, characterClass);
        }
    }
});
