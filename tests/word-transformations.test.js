import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");
const schema = JSON.parse(
    readFileSync(path.join(ROOT, "data/library/schema.json"), "utf8"),
);
const words = readdirSync(path.join(ROOT, "data/library/content/words"))
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) =>
        JSON.parse(
            readFileSync(
                path.join(ROOT, "data/library/content/words", name),
                "utf8",
            ),
        ),
    );
const definitions = readdirSync(
    path.join(ROOT, "data/library/content/definitions"),
)
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) =>
        JSON.parse(
            readFileSync(
                path.join(ROOT, "data/library/content/definitions", name),
                "utf8",
            ),
        ),
    );

function transformedValues(entry) {
    return transformationNodes(entry).map(({ value }) => value);
}

function transformationNodes(entry) {
    const tags = new Set(entry.tags ?? []);
    return (schema.transformSets ?? []).flatMap((set) => {
        if (!set.matchTags.every((tag) => tags.has(tag))) return [];
        const nodes = [
            {
                state: set.baseState,
                value: entry.label,
                pronunciation: entry.fields.pronunciation[0],
                path: [],
            },
        ];
        const seen = new Set([`${set.baseState}\0${entry.label}`]);
        for (let index = 0; index < nodes.length; index += 1) {
            const node = nodes[index];
            for (const rule of set.rules) {
                if (
                    rule.fromState !== node.state ||
                    !node.value.endsWith(rule.removeSuffix)
                )
                    continue;
                const value = `${node.value.slice(
                    0,
                    node.value.length - rule.removeSuffix.length,
                )}${rule.append}`;
                const key = `${rule.toState}\0${value}`;
                if (seen.has(key)) continue;
                seen.add(key);
                const pronunciation = rule.pronunciation;
                nodes.push({
                    state: rule.toState,
                    value,
                    pronunciation:
                        pronunciation &&
                        node.pronunciation.endsWith(pronunciation.removeSuffix)
                            ? `${node.pronunciation.slice(
                                  0,
                                  node.pronunciation.length -
                                      pronunciation.removeSuffix.length,
                              )}${pronunciation.append}`
                            : node.pronunciation,
                    definition: rule.definition,
                    rule,
                    definitionRules: [...(node.definitionRules ?? []), rule],
                    path: [...node.path, rule.id],
                });
            }
        }
        return nodes.slice(1);
    });
}

function annotatedDefinitions(baseDefinitions, node, language) {
    const localized = (metadata) =>
        typeof metadata === "string"
            ? metadata
            : (metadata?.labels?.[language] ??
              Object.values(metadata?.labels ?? {})[0]);
    return baseDefinitions.map((baseDefinition) =>
        (node.definitionRules ?? [node.rule]).reduce((definition, rule) => {
            const transform = rule.definitionTransform;
            if (!transform) return localized(rule.definition) ?? definition;
            for (const replacement of transform.replacements ?? []) {
                const match = localized(replacement.match);
                if (!match || !definition.includes(match)) continue;
                return definition.replaceAll(
                    match,
                    localized(replacement.replacement),
                );
            }
            const prefix = localized(transform.matchPrefix) ?? "";
            const suffix = localized(transform.matchSuffix) ?? "";
            if (
                (prefix && !definition.startsWith(prefix)) ||
                (suffix && !definition.endsWith(suffix))
            )
                return definition;
            const stem = definition.slice(
                prefix.length,
                suffix ? -suffix.length : undefined,
            );
            return localized(transform.template)
                .replaceAll("{{ definition }}", definition)
                .replaceAll("{{ stem }}", stem)
                .replaceAll("{{ prefix }}", prefix)
                .replaceAll("{{ suffix }}", suffix);
        }, baseDefinition),
    );
}

test("Vocabulary declares separate verb, adverb, and copula transform views", () => {
    const wordLayer = schema.layers.find(({ id }) => id === "words");
    assert.deepEqual(
        wordLayer.views.map(({ id, includeTags, layout }) => ({
            id,
            includeTags,
            layout,
        })),
        [
            {
                id: "verbs",
                includeTags: ["verb"],
                layout: "transformTree",
            },
            {
                id: "adverbs",
                includeTags: ["adverb"],
                layout: "transformTree",
            },
            {
                id: "copulas",
                includeTags: ["copula"],
                layout: "transformTree",
            },
        ],
    );

    const visibleLexical = words.filter(({ hidden }) => hidden !== true);
    const verbs = visibleLexical.filter(({ class: contentClass }) =>
        contentClass?.startsWith("lexical:verb"),
    );
    const adverbs = visibleLexical.filter(
        ({ class: contentClass }) => contentClass === "lexical:adverb",
    );
    assert.ok(verbs.length > 0);
    assert.ok(adverbs.length > 0);
    for (const verb of verbs) {
        assert.equal(verb.tags?.[0], "verb", verb.id);
        assert.equal(verb.tags?.length, 2, verb.id);
    }
    for (const adverb of adverbs) {
        assert.deepEqual(adverb.tags, ["adverb"], adverb.id);
        assert.deepEqual(transformedValues(adverb), [], adverb.id);
    }
});

test("Japanese verb families derive reviewed polite, negative, past, and te forms", () => {
    const expected = new Map([
        ["ja:word:taberu", ["食べます", "食べない", "食べた", "食べて"]],
        ["ja:word:nomu", ["飲みます", "飲まない", "飲んだ", "飲んで"]],
        ["ja:word:miru", ["見ます", "見ない", "見た", "見て"]],
        ["ja:word:iku", ["行きます", "行かない", "行った", "行って"]],
        ["ja:word:kuru", ["来ます", "来ない", "来た", "来て"]],
        ["ja:word:naosu", ["直します", "直さない", "直した", "直して"]],
        ["ja:word:manabu", ["学びます", "学ばない", "学んだ", "学んで"]],
        ["ja:word:aruku", ["歩きます", "歩かない", "歩いた", "歩いて"]],
        ["ja:word:iru-exist", ["います", "いない", "いた", "いて"]],
        ["ja:word:aru-exist", ["あります", "ない", "あった", "あって"]],
    ]);
    const wordsById = new Map(words.map((entry) => [entry.id, entry]));
    for (const [id, forms] of expected) {
        const transformed = transformedValues(wordsById.get(id));
        for (const form of forms) assert.ok(transformed.includes(form), id);
    }
});

test("the plain copula branches into past, negative, and connective forms", () => {
    const da = words.find(({ id }) => id === "ja:word:da-copula");
    assert.deepEqual(
        transformationNodes(da).map(({ state, value, pronunciation }) => ({
            state,
            value,
            pronunciation,
        })),
        [
            { state: "past", value: "だった", pronunciation: "だった" },
            {
                state: "negative",
                value: "ではない",
                pronunciation: "ではない",
            },
            { state: "connective", value: "で", pronunciation: "で" },
            {
                state: "negative-past",
                value: "ではなかった",
                pronunciation: "ではなかった",
            },
        ],
    );
});

test("verb transformation trees branch deeply with dynamic readings and definitions", () => {
    const wordsById = new Map(words.map((entry) => [entry.id, entry]));
    const taberu = transformationNodes(wordsById.get("ja:word:taberu"));
    const deepest = taberu.find(
        ({ state }) => state === "causative-continuous-negative-desire",
    );
    assert.deepEqual(
        {
            value: deepest.value,
            pronunciation: deepest.pronunciation,
            path: deepest.path,
            definition: annotatedDefinitions(["to eat"], deepest, "en")[0],
        },
        {
            value: "食べさせたくなくて",
            pronunciation: "たべさせたくなくて",
            path: [
                "causative",
                "causative-desire",
                "causative-negative-desire",
                "causative-continuous-negative-desire",
            ],
            definition: "to (not want to make or let someone) eat (and then)",
        },
    );
    const kuru = transformationNodes(wordsById.get("ja:word:kuru"));
    assert.deepEqual(
        kuru
            .filter(({ state }) =>
                ["polite", "causative", "potential"].includes(state),
            )
            .map(({ state, value, pronunciation }) => ({
                state,
                value,
                pronunciation,
            })),
        [
            { state: "polite", value: "来ます", pronunciation: "きます" },
            {
                state: "causative",
                value: "来させる",
                pronunciation: "こさせる",
            },
            {
                state: "potential",
                value: "来られる",
                pronunciation: "こられる",
            },
        ],
    );
});

test("every transformation exposes a localized definition transform", () => {
    for (const set of schema.transformSets) {
        for (const rule of set.rules) {
            assert.ok(
                rule.definitionTransform.template ||
                    rule.definitionTransform.replacements?.length,
                `${set.id}:${rule.id}`,
            );
            for (const field of ["matchPrefix", "matchSuffix", "template"]) {
                if (!rule.definitionTransform[field]) continue;
                assert.deepEqual(
                    Object.keys(rule.definitionTransform[field].labels).sort(),
                    ["de", "en", "id", "ja"],
                );
                for (const value of Object.values(
                    rule.definitionTransform[field].labels,
                ))
                    assert.ok(value.trim(), `${set.id}:${rule.id}:${field}`);
            }
        }
    }
});

test("desire transforms each definition of 見る independently", () => {
    const wordsById = new Map(words.map((entry) => [entry.id, entry]));
    const definitionsById = new Map(
        definitions.map((entry) => [entry.id, entry]),
    );
    const miru = wordsById.get("ja:word:miru");
    const baseDefinitions = miru.references
        .filter(({ relation }) => relation === "definitions")
        .map(
            ({ entryId }) =>
                definitionsById.get(entryId).fields.translations.en,
        );
    assert.deepEqual(baseDefinitions, ["to see", "to watch"]);

    const desire = transformationNodes(miru).find(
        ({ state }) => state === "desire",
    );
    assert.equal(desire.value, "見たい");
    assert.equal(desire.pronunciation, "みたい");
    assert.deepEqual(annotatedDefinitions(baseDefinitions, desire, "en"), [
        "to (want to) see",
        "to (want to) watch",
    ]);
});

test("contextual replacements rewrite prior definition transforms", () => {
    const wordsById = new Map(words.map((entry) => [entry.id, entry]));
    const miru = transformationNodes(wordsById.get("ja:word:miru"));
    const desirePast = miru.find(({ state }) => state === "desire-past");
    assert.equal(desirePast.value, "見たかった");
    assert.deepEqual(annotatedDefinitions(["to see"], desirePast, "en"), [
        "to (have wanted to) see",
    ]);

    const desireTe = miru.find(({ state }) => state === "desire-te");
    assert.deepEqual(annotatedDefinitions(["to see"], desireTe, "en"), [
        "to (want to) see (and then)",
    ]);
});

test("every verb definition provides localized transform boundaries", () => {
    const definitionsById = new Map(
        definitions.map((entry) => [entry.id, entry]),
    );
    const verbs = words.filter(
        ({ hidden, tags }) => hidden !== true && tags?.includes("verb"),
    );
    for (const verb of verbs) {
        const definitionIds = verb.references
            .filter(({ relation }) => relation === "definitions")
            .map(({ entryId }) => entryId);
        assert.ok(definitionIds.length > 0, verb.id);
        for (const definitionId of definitionIds) {
            const definition = definitionsById.get(definitionId);
            assert.ok(!definition.label.includes("{{ marker }}"), definitionId);
            assert.deepEqual(
                Object.keys(definition.fields.translations).sort(),
                ["de", "en", "id", "ja"],
                definitionId,
            );
            const prefixes = { de: "zu ", en: "to ", id: "untuk ", ja: "〜" };
            for (const [language, translation] of Object.entries(
                definition.fields.translations,
            )) {
                assert.ok(
                    translation.startsWith(prefixes[language]),
                    definitionId,
                );
                assert.ok(!translation.includes("{{ marker }}"), definitionId);
            }
        }
    }
});

test("transform declarations are effective, localized, and unambiguous", () => {
    for (const set of schema.transformSets) {
        const transitions = new Set();
        for (const rule of set.rules) {
            assert.notEqual(`${rule.removeSuffix}\0${rule.append}`, "\0");
            assert.equal(typeof rule.pronunciation.removeSuffix, "string");
            assert.equal(typeof rule.pronunciation.append, "string");
            const transition = `${rule.fromState}\0${rule.toState}`;
            assert.ok(!transitions.has(transition), `${set.id}:${transition}`);
            transitions.add(transition);
            assert.deepEqual(Object.keys(rule.metadata.labels).sort(), [
                "de",
                "en",
                "id",
                "ja",
            ]);
            if (rule.definition)
                assert.deepEqual(Object.keys(rule.definition.labels).sort(), [
                    "de",
                    "en",
                    "id",
                    "ja",
                ]);
            assert.ok(rule.definitionTransform?.template);
            for (const replacement of rule.definitionTransform?.replacements ??
                []) {
                for (const field of ["match", "replacement"])
                    assert.deepEqual(
                        Object.keys(replacement[field].labels).sort(),
                        ["de", "en", "id", "ja"],
                    );
            }
        }
    }
});

test("content ships only base verbs, adverbs, and copulas, never generated forms", () => {
    const baseEntries = words.filter(
        ({ hidden, tags }) =>
            hidden !== true &&
            (tags?.includes("verb") ||
                tags?.includes("adverb") ||
                tags?.includes("copula")),
    );
    const baseIds = new Set(baseEntries.map(({ id }) => id));
    const generated = new Set(
        baseEntries.flatMap((entry) => transformedValues(entry)),
    );
    assert.equal(baseIds.size, 13);
    assert.ok(generated.size > 0);
    assert.deepEqual(
        words
            .filter(
                ({ hidden, label }) => hidden !== true && generated.has(label),
            )
            .map(({ id }) => id),
        [],
    );
});
