import path from "node:path";

const CONTENT_PACK = Object.freeze({
    id: "japanese-core",
    publisher: "Cognis Labs HQ",
    namespace: "ja",
    version: "5.0.1",
    contentRevision: "2026-09-08.5",
    schema: "schema.json",
    content: "content",
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
    version: "5.0.1",
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
    const library = ctx.getCapability("study:library");
    if (!library || typeof library.ingestContentPack !== "function") {
        throw new Error("Cognis Japanese requires study:library.");
    }
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    const receipt = await library.ingestContentPack(
        path.join(ctx.moduleRoot, "data", "library"),
    );
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
}
