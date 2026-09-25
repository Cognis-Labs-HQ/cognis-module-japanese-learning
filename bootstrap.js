import path from "node:path";
import { createStrokePatternProvider } from "./api/stroke-pattern-provider.js";

const CONTENT_PACK = Object.freeze({
    id: "japanese-core",
    publisher: "Cognis Labs HQ",
    namespace: "ja",
    version: "2.2.33",
    contentRevision: "2026-09-25.1",
    schema: "schema.json",
    content: "content",
    protected: true,
    metadata: Object.freeze({
        catalog: Object.freeze({ category: "language", featured: true }),
        tags: Object.freeze(["japanese", "study"]),
        sources: Object.freeze([
            Object.freeze({
                id: "kanjivg",
                url: "https://kanjivg.tagaini.net/",
                license: "CC-BY-SA-3.0",
                attribution: "KanjiVG project contributors",
                derivedFields: Object.freeze([
                    "characters.stroke_pattern",
                    "alt-characters.stroke_pattern",
                ]),
            }),
        ]),
    }),
    license: Object.freeze({
        id: "AGPL-3.0-or-later",
        url: "https://www.gnu.org/licenses/agpl-3.0.html",
        attribution: "Cognis Labs HQ",
    }),
});

const LANGUAGE = Object.freeze({
    moduleId: "study-language-ja",
    code: "ja",
    languageCode: "ja",
    languageName: "日本語",
    languageFlag: "🇯🇵",
    version: "2.2.33",
    package: CONTENT_PACK,
    childComponents: [],
});

export async function uninstallModule(ctx, { deleteContent }) {
    ctx.log?.("info", "Japanese language pack cleanup completed.", {
        component: "study-language-ja",
        operation: "uninstall_cleanup",
        deleteContent,
    });
}

export async function bootstrapModule(ctx) {
    const library = ctx.getCapability("study:library:provider");
    if (
        !library ||
        typeof library.ingestContentPack !== "function" ||
        typeof library.registerLookupProvider !== "function"
    ) {
        throw new Error("Cognis Japanese requires study:library:provider.");
    }
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    const libraryRoot = path.join(ctx.moduleRoot, "data", "library");
    const removeLookupProvider = library.registerLookupProvider(
        createStrokePatternProvider({
            contentRoot: path.join(libraryRoot, "content"),
            log: ctx.log,
        }),
    );
    let receipt;
    try {
        receipt = await library.ingestContentPack(libraryRoot);
    } catch (error) {
        removeLookupProvider();
        throw error;
    }
    ctx.contributePublicCapability("study:language:ja", LANGUAGE);
    ctx.flow.extend(
        "bootstrap-platform",
        "register-flows",
        { id: "study-language-ja:register-language" },
        () => LANGUAGE,
    );
    ctx.log?.("info", "Cognis Japanese content pack enabled.", {
        component: "study-language-ja",
        operation: "bootstrap",
        packId: receipt.packId,
        contentRevision: receipt.contentRevision,
        unchanged: receipt.unchanged,
    });
    return removeLookupProvider;
}
