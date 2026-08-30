import { registerApi } from "./api/index.js";

const LANGUAGE = {
    moduleId: "study-language-ja",
    languageCode: "ja",
    languageName: "日本語",
    languageFlag: "🇯🇵",
    version: "1.3.2",
    childComponents: [
        {
            id: "hiragana-alphabet",
            label: "module.study-language-ja.hiragana",
            pageUrl: "/study/hiragana",
            order: 0,
        },
        {
            id: "library",
            label: "module.study-language-ja.library",
            pageUrl: "/study/library",
            order: 100,
        },
        {
            id: "classroom",
            label: "module.study-language-ja.classroom",
            pageUrl: "/study/ja-classroom",
            order: 999,
        },
    ],
};

export async function uninstallModule(ctx, { deleteContent }) {
    ctx.log?.("info", "Japanese learning module cleanup completed.", {
        component: "study-language-ja",
        operation: "uninstall_cleanup",
        deleteContent,
    });
}

export async function bootstrapModule(ctx) {
    const library = await registerApi(ctx);
    ctx.contributePublicCapability(
        "study:language:ja",
        Object.freeze(LANGUAGE),
    );
    ctx.contributePublicCapability("study:library", library);
    ctx.contributePublicCapability("study:language:ja:library", library);
    ctx.flow.extend(
        "bootstrap-platform",
        "register-flows",
        { id: "study-language-ja:register-language" },
        () => LANGUAGE,
    );
    ctx.log?.("info", "Cognis Japanese enabled.", {
        component: "study-language-ja",
        operation: "bootstrap",
    });
}
