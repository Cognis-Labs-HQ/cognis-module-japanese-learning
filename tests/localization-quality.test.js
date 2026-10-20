import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const LANGUAGES = ["de", "en", "id", "ja"];

function strings(language) {
    const xml = readFileSync(
        resolve(ROOT, `ui/languages/${language}/strings.xml`),
        "utf8",
    );
    return new Map(
        [...xml.matchAll(/<string name="([^"]+)">([^<]*)<\/string>/g)].map(
            (match) => [match[1], match[2]],
        ),
    );
}

test("localized resources keep matching key sets", () => {
    const englishKeys = [...strings("en").keys()].sort();
    for (const language of LANGUAGES.filter((entry) => entry !== "en")) {
        assert.deepEqual([...strings(language).keys()].sort(), englishKeys);
    }
});

test("manifest preference localization keys exist in every language", () => {
    const manifest = JSON.parse(
        readFileSync(resolve(ROOT, "manifest.json"), "utf8"),
    );
    for (const preference of manifest.ui?.preferences ?? []) {
        for (const language of LANGUAGES) {
            assert.ok(strings(language).has(preference.labelKey));
            assert.ok(strings(language).has(preference.descriptionKey));
        }
    }
});

test("manifest publishes the module locale bundle location", () => {
    const manifest = JSON.parse(
        readFileSync(resolve(ROOT, "manifest.json"), "utf8"),
    );
    assert.equal(
        manifest.ui?.stringsBaseUrl,
        "/static/modules/study-language-ja/languages",
    );
});

test("English titles use Title Case", () => {
    const violations = [];
    for (const [key, value] of strings("en")) {
        if (!key.endsWith(".title") && !key.endsWith("page_title")) continue;
        const valid = value
            .split(/\s+/)
            .filter(Boolean)
            .every((word) => {
                const text = word
                    .replace(/^[^A-Za-z]*/, "")
                    .replace(/[^A-Za-z]*$/, "");
                return !text || text[0] === text[0].toUpperCase();
            });
        if (!valid) violations.push(`${key}: ${value}`);
    }
    assert.deepEqual(violations, []);
});

function validateDefinitionLocales(definitions, prefix, resources) {
    const catalogs = new Map();
    const modulePrefix = `${prefix.split(":")[0]}:`;
    for (const [locale, xml] of Object.entries(resources)) {
        const keys = [...xml.matchAll(/<string\s+name="([^"]+)"/g)].map(
            (match) => match[1],
        );
        assert.equal(
            keys.length,
            new Set(keys).size,
            `${locale}: duplicate locale key`,
        );
        const scoped = keys.filter((key) => key.startsWith(modulePrefix));
        for (const key of scoped)
            assert.match(
                key.slice(key.lastIndexOf(":") + 1),
                /^[a-z0-9]+(?:\.[a-z0-9]+)*$/,
                `${locale}: lowercase period-delimited key required`,
            );
        catalogs.set(locale, new Set(keys));
    }
    const referenceKeys = [...catalogs.get("en")].sort();
    for (const [locale, keys] of catalogs) {
        assert.deepEqual(
            [...keys].sort(),
            referenceKeys,
            `${locale}: locale key parity`,
        );
        for (const definition of definitions) {
            assert.ok(definition.fields.string_key.startsWith(modulePrefix));
            assert.ok(
                keys.has(definition.fields.string_key),
                `${locale}: missing definition reference ${definition.id}`,
            );
        }
    }
}

test("definition locale keys have valid grammar, uniqueness, parity and complete references", () => {
    const schema = JSON.parse(
        readFileSync(resolve(ROOT, "data/library/schema.json"), "utf8"),
    );
    const definitionRoot = resolve(ROOT, "data/library/content/definitions");
    const definitions = readdirSync(definitionRoot)
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) =>
            JSON.parse(readFileSync(resolve(definitionRoot, name), "utf8")),
        );
    const prefix = schema.layers.find(({ id }) => id === "definitions")
        .definitionLocalization.stringKeyPrefix;
    const resources = Object.fromEntries(
        ["de", "en", "id", "ja"].map((locale) => [
            locale,
            readFileSync(`ui/languages/${locale}/strings.xml`, "utf8"),
        ]),
    );
    validateDefinitionLocales(definitions, prefix, resources);
    const key = definitions[0].fields.string_key;
    for (const suffix of ["invalid_key", "invalid-key"]) {
        const changed = {
            ...resources,
            en: resources.en.replace(
                `name="${key}"`,
                `name="${prefix}:${suffix}"`,
            ),
        };
        assert.throws(
            () => validateDefinitionLocales(definitions, prefix, changed),
            /period-delimited/,
        );
    }
    const duplicate = {
        ...resources,
        en: resources.en.replace(
            "</resources>",
            `<string name="${key}">duplicate</string></resources>`,
        ),
    };
    assert.throws(
        () => validateDefinitionLocales(definitions, prefix, duplicate),
        /duplicate locale key/,
    );
    const asymmetric = {
        ...resources,
        de: resources.de.replace(
            `name="${key}"`,
            `name="${prefix}:missing.translation"`,
        ),
    };
    assert.throws(
        () => validateDefinitionLocales(definitions, prefix, asymmetric),
        /locale key parity/,
    );
    const detached = structuredClone(definitions);
    detached[0].fields.string_key = `${prefix}:missing.definition`;
    assert.throws(
        () => validateDefinitionLocales(detached, prefix, resources),
        /missing definition reference/,
    );
});
