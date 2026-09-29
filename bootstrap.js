import path from "node:path";
import { registerJishoLookupProvider } from "./api/jisho-lookup-provider.js";
import { createStrokePatternProvider } from "./api/stroke-pattern-provider.js";

const CONTENT_PACK = Object.freeze({
    id: "japanese-core",
    publisher: "Cognis Labs HQ",
    namespace: "ja",
    version: "2.2.61",
    contentRevision: "2026-09-29.1",
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
                revision: "422b5538595676da918c288a4230cb5e22a1ee7e",
                derivedFields: Object.freeze([
                    "characters.stroke_pattern",
                    "alt-characters.stroke_pattern",
                ]),
            }),
            Object.freeze({
                id: "kanjidic2-via-kanjiapi",
                url: "https://kanjiapi.dev/",
                license: "EDRDG Electronic Dictionary Licence",
                attribution:
                    "Electronic Dictionary Research and Development Group",
                derivedFields: Object.freeze(["alt-characters.pronunciation"]),
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
    version: "2.2.61",
    package: CONTENT_PACK,
    childComponents: [],
});

export async function uninstallModule(ctx, { deleteContent }) {
    if (!deleteContent) {
        ctx.log?.("info", "Japanese language pack content retained.", {
            component: "study-language-ja",
            operation: "uninstall_cleanup",
            deleteContent: false,
        });
        return;
    }

    const library = ctx.getCapability("study:library:provider");
    if (typeof library?.deleteContentPack !== "function") {
        ctx.log?.("error", "Japanese language pack cleanup is unavailable.", {
            component: "study-language-ja",
            operation: "delete_content_pack",
            packId: CONTENT_PACK.id,
        });
        throw new Error("Study Library content-pack cleanup is unavailable.");
    }

    const libraryRoot = path.join(ctx.moduleRoot, "data", "library");
    try {
        await library.deleteContentPack(libraryRoot);
    } catch (error) {
        ctx.log?.("error", "Japanese language pack cleanup failed.", {
            component: "study-language-ja",
            operation: "delete_content_pack",
            packId: CONTENT_PACK.id,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
    ctx.log?.("info", "Japanese language pack content deleted.", {
        component: "study-language-ja",
        operation: "delete_content_pack",
        packId: CONTENT_PACK.id,
    });
}

export async function bootstrapModule(ctx) {
    const library =
        ctx.capabilities.get("study:library:provider") ??
        ctx.capabilities.require("study:library");
    if (
        typeof library.ingestContentPack !== "function" ||
        typeof library.registerLookupProvider !== "function"
    ) {
        throw new Error("Invalid Study Library provider capability.");
    }
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    ctx.registerApiDelete(
        "/api/v1/modules/study-language-ja/config",
        (_request, response) => {
            response.writeHead(204);
            response.end();
        },
        { access: { minRole: "admin" }, allowWhenDisabled: true },
    );
    const libraryRoot = path.join(ctx.moduleRoot, "data", "library");
    const providerRemovers = [];
    const removeLookupProviders = () => {
        for (const removeProvider of providerRemovers.splice(0).reverse())
            removeProvider();
    };
    let receipt;
    try {
        providerRemovers.push(
            library.registerLookupProvider(
                createStrokePatternProvider({
                    contentRoot: path.join(libraryRoot, "content"),
                    log: ctx.log,
                }),
            ),
        );
        providerRemovers.push(
            registerJishoLookupProvider(library, {
                contentRoot: path.join(libraryRoot, "content"),
                log: ctx.log,
            }),
        );
        receipt = await library.ingestContentPack(libraryRoot);
    } catch (error) {
        removeLookupProviders();
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
    return removeLookupProviders;
}
