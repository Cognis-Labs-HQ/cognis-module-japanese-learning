import path from "node:path";

const LANGUAGE = Object.freeze({
    moduleId: "study-language-ja",
    languageCode: "ja",
    languageName: "日本語",
    languageFlag: "🇯🇵",
    version: "2.0.3",
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
