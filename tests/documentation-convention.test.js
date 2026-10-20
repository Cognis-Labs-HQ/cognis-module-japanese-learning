import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE = resolve(ROOT, ".github/DOCUMENTATION_TEMPLATE.en.md");
const LANGUAGES = ["de", "en", "id", "ja"];

function markdownFiles(directory) {
    return readdirSync(directory).flatMap((name) => {
        const path = resolve(directory, name);
        if (statSync(path).isDirectory()) return markdownFiles(path);
        return name.endsWith(".md") ? [path] : [];
    });
}

function headingLevels(path) {
    return readFileSync(path, "utf8")
        .split("\n")
        .filter((line) => /^#{1,6} /.test(line))
        .map((line) => line.match(/^#+/)[0].length);
}

function changelogFiles() {
    const directory = resolve(ROOT, "docs/changelog");
    return markdownFiles(directory);
}

test("documentation follows the hidden heading convention", () => {
    const expected = headingLevels(TEMPLATE).slice(0, 3);
    const violations = markdownFiles(resolve(ROOT, "docs")).flatMap((path) => {
        const actual = headingLevels(path).slice(0, expected.length);
        return actual.length === expected.length &&
            actual.every((level, index) => level === expected[index])
            ? []
            : [relative(ROOT, path)];
    });
    assert.deepEqual(violations, []);
});

test("documentation templates exist for every supported language", () => {
    const expected = headingLevels(TEMPLATE);
    for (const language of LANGUAGES) {
        const template = resolve(
            ROOT,
            `.github/DOCUMENTATION_TEMPLATE.${language}.md`,
        );
        assert.ok(statSync(template).isFile());
        assert.deepEqual(headingLevels(template), expected);
    }
});

test("every documentation topic has one variant per supported language", () => {
    const documents = markdownFiles(resolve(ROOT, "docs"));
    const families = new Map();
    for (const path of documents) {
        const relativePath = relative(resolve(ROOT, "docs"), path);
        const match = /^(.*)\.(de|en|id|ja)\.md$/.exec(relativePath);
        assert.ok(
            match,
            `${relative(ROOT, path)} must include a language suffix`,
        );
        const [, topic, language] = match;
        const variants = families.get(topic) ?? new Set();
        variants.add(language);
        families.set(topic, variants);
    }
    for (const [topic, variants] of families) {
        assert.deepEqual([...variants].sort(), [...LANGUAGES].sort(), topic);
    }
});

test("localized changelogs identify their feature branch and commits", () => {
    const families = new Map();
    for (const path of changelogFiles()) {
        const name = relative(resolve(ROOT, "docs/changelog"), path);
        const match = /^(.*)\.(de|en|id|ja)\.md$/.exec(name);
        assert.ok(
            match,
            `${relative(ROOT, path)} must include a language suffix`,
        );
        const [, topic, language] = match;
        const variants = families.get(topic) ?? new Set();
        variants.add(language);
        families.set(topic, variants);

        const markdown = readFileSync(path, "utf8");
        const branchMatches = [
            ...markdown.matchAll(
                /^\*\*(?:Feature Branch|Feature-Zweig|Cabang Fitur|機能ブランチ):\*\*\s+(.+)$/gm,
            ),
        ];
        const branch = branchMatches[0]?.[1]?.trim();
        const hasCommitSection = /^## .*?(?:commits?|komit|コミット).*$/im.test(
            markdown,
        );
        assert.equal(branchMatches.length, 1, relative(ROOT, path));
        assert.ok(branch, relative(ROOT, path));
        assert.ok(hasCommitSection, relative(ROOT, path));
    }
    for (const [topic, variants] of families) {
        assert.deepEqual([...variants].sort(), [...LANGUAGES].sort(), topic);
    }
});

function validateDurableInventoryProse(markdown) {
    const prose = markdown
        .split("\n")
        .filter((line) => !line.startsWith("- ["))
        .join("\n")
        .replace(/`[^`]*`/g, "")
        .replace(/https?:\/\/\S+/g, "");
    const snapshotPatterns = [
        /^\|[^\n|]+\|\s*\d[\d,.]*\s*\|\s*$/m,
        /\b\d+\s+(?:[\w,-]+\s+){0,7}(?:starter decks|vocabulary cards|linked sentences|illustrations|paradigms)\b/i,
        /\b(?:\d+|eight|fifteen|sixteen|thirty)\s+(?:reviewed |everyday |additional |supporting )?(?:nouns|sentences|recordings|cards)\b/i,
        /\b\d+\s+(?:[\wÄÖÜäöüß-]+\s+){0,3}(?:Startdecks|Vokabelkarten|Illustrationen|Adjektivparadigmen)\b/i,
        /\b(?:\d+|empat|delapan|sepuluh)\s+(?:dek awal|kartu kosakata|ilustrasi|paradigma)\b/i,
        /(?:語彙|名詞|例文|イラスト|録音|デッキ|活用群)\s*\d+\s*(?:件|枚|個|語|文)?/u,
        /\d+\s*(?:個の翻訳済み初期デッキ|語の表記|件のイラスト|枚の語彙カード)/u,
        /\((?:\d+) (?:cards|Karten|kartu)\)|（\d+件）/u,
    ];
    for (const pattern of snapshotPatterns) {
        assert.doesNotMatch(
            prose,
            pattern,
            "Static documentation must describe content without snapshot inventory totals",
        );
    }
}

test("localized documentation describes content durably and retains inventory-format guidance", () => {
    for (const locale of LANGUAGES) {
        for (const path of [
            `README.${locale}.md`,
            `docs/index.${locale}.md`,
            `docs/changelog/feature-expand-themed-practice.${locale}.md`,
        ]) {
            const markdown = readFileSync(resolve(ROOT, path), "utf8");
            validateDurableInventoryProse(markdown);
            if (!path.startsWith("docs/changelog/")) {
                assert.ok(markdown.includes("data/audio/indexes/"), path);
                assert.ok(markdown.includes("data/audio/inventories/"), path);
            }
        }
    }
    for (const stale of [
        "77 localized starter decks",
        "37 declarative verb and adjective paradigms",
        "| Sentences | 309 |",
        "275枚の語彙カード",
        "355 kartu kosakata",
    ]) {
        assert.throws(
            () => validateDurableInventoryProse(stale),
            /snapshot inventory totals/,
        );
    }
    validateDurableInventoryProse(
        "Inventory format 2 uses 24 kHz, 16-bit PCM; shards stay below 800 lines. Requests time out after 15 seconds.",
    );
});
