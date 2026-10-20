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

function packagedContentCounts() {
    const readJson = (path) =>
        JSON.parse(readFileSync(resolve(ROOT, path), "utf8"));
    const words = readdirSync(resolve(ROOT, "data/library/content/words"))
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) => readJson(`data/library/content/words/${name}`));
    const sentences = readdirSync(
        resolve(ROOT, "data/library/content/sentences"),
    )
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) => readJson(`data/library/content/sentences/${name}`));
    return [
        readJson("data/starter-decks.json").length,
        words.filter(
            (word) => word.class?.startsWith("lexical:") && !word.hidden,
        ).length,
        sentences.length,
        readJson("data/library/assets/images/catalog.json").images.length,
    ];
}

function validateDocumentedCounts(markdown, labels, counts) {
    const rows = new Map(
        markdown
            .split("\n")
            .filter((line) => line.startsWith("|"))
            .map((line) =>
                line
                    .split("|")
                    .slice(1, -1)
                    .map((cell) => cell.trim()),
            ),
    );
    labels.forEach((label, index) =>
        assert.equal(
            Number(rows.get(label)),
            counts[index],
            `stale content count: ${label}`,
        ),
    );
}

test("localized documentation reports actual packaged counts and both inventory levels", () => {
    const labels = {
        en: [
            "Starter decks",
            "Visible vocabulary cards",
            "Sentences",
            "Vocabulary illustrations",
        ],
        de: [
            "Startdecks",
            "Sichtbare Vokabelkarten",
            "Sätze",
            "Vokabelillustrationen",
        ],
        id: [
            "Dek awal",
            "Kartu kosakata yang terlihat",
            "Kalimat",
            "Ilustrasi kosakata",
        ],
        ja: ["初期デッキ", "表示対象の語彙カード", "文", "語彙イラスト"],
    };
    const counts = packagedContentCounts();
    for (const locale of LANGUAGES) {
        for (const path of [`README.${locale}.md`, `docs/index.${locale}.md`]) {
            const markdown = readFileSync(resolve(ROOT, path), "utf8");
            validateDocumentedCounts(markdown, labels[locale], counts);
            assert.ok(markdown.includes("data/audio/indexes/"), path);
            assert.ok(markdown.includes("data/audio/inventories/"), path);
        }
    }
    assert.throws(
        () =>
            validateDocumentedCounts(
                "| Starter decks | 10 |",
                labels.en,
                counts,
            ),
        /stale content count/,
    );
});
