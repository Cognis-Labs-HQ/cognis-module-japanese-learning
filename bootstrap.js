import { readFileSync } from "node:fs";
import path from "node:path";
import { registerJishoLookupProvider } from "./api/jisho-lookup-provider.js";
import { createStrokePatternProvider } from "./api/stroke-pattern-provider.js";

const CONTENT_PACK = Object.freeze(
    JSON.parse(
        readFileSync(
            new URL("./data/library/manifest.json", import.meta.url),
            "utf8",
        ),
    ),
);
const MODULE_MANIFEST = JSON.parse(
    readFileSync(new URL("./manifest.json", import.meta.url), "utf8"),
);

const LANGUAGE = Object.freeze({
    moduleId: "study-language-ja",
    code: "ja",
    languageCode: "ja",
    languageName: "日本語",
    languageFlag: "🇯🇵",
    version: MODULE_MANIFEST.version,
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
                cacheRevision: MODULE_MANIFEST.version,
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
