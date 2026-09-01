import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navigationSource = readFileSync(
    new URL("../reuse/study-sub-navigation.js", import.meta.url),
    "utf8",
);

test("Japanese Study sub-navigation resolves every module label through i18n", () => {
    for (const labelKey of [
        "module.study-language-ja.hiragana",
        "module.study-language-ja.library",
        "module.study-language-ja.classroom",
    ]) {
        assert.match(navigationSource, new RegExp(`labelKey: "${labelKey}"`));
    }
    assert.match(navigationSource, /i18n\.t\(labelKey\)/);
});

test("Japanese Study sub-navigation routes clicks through the host router", () => {
    assert.match(
        navigationSource,
        /import \{ navigateTo \} from "\/static\/reuse\/app-router\.js"/,
    );
    assert.match(navigationSource, /event\.preventDefault\(\)/);
    assert.match(navigationSource, /void navigateTo\(/);
});

test("every Japanese Study page enhances its sub-navigation", () => {
    for (const component of ["hiragana-alphabet", "library", "classroom"]) {
        const source = readFileSync(
            new URL(`../components/${component}/ui/app.js`, import.meta.url),
            "utf8",
        );
        assert.match(source, /enhanceJapaneseStudySubNavigation/);
    }
});
