import { registerApi } from "./api/index.js";

const LANGUAGE = {
    moduleId: "study-language-ja",
    languageCode: "ja",
    languageName: "日本語",
    languageFlag: "🇯🇵",
    version: "1.2.12",
    childComponents: [
        {
            id: "hiragana-alphabet",
            label: "Hiragana Alphabet",
            pageUrl: "/study/hiragana",
            order: 0,
        },
        {
            id: "library",
            label: "Library",
            pageUrl: "/study/library",
            minRole: "admin",
            order: 100,
        },
        {
            id: "classroom",
            label: "Classroom",
            pageUrl: "/study/ja-classroom",
            order: 999,
        },
    ],
};

export async function bootstrapModule(ctx) {
    const store = await registerApi(ctx);
    ctx.contributePublicCapability(
        "study:language:ja",
        Object.freeze(LANGUAGE),
    );
    ctx.contributePublicCapability("study:language:ja:library", {
        snapshot: () => store.snapshot(),
        queryLayer: (layer, query) => store.queryLayer(layer, query),
    });
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
