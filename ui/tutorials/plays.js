export const definition = {
    moduleId: "study-language-ja",
    language: "ja",
    version: 1,
    id: "introduction",
    titleKey: "module.study-language-ja.tutorial.title",
    steps: [
        {
            highlightNext: true,
            id: "welcome",
            target: "study.languages",
            titleKey: "module.study-language-ja.tutorial.welcome.title",
            bodyKey: "module.study-language-ja.tutorial.welcome.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
        },
        {
            highlightNext: true,
            id: "explore",
            titleKey: "module.study-language-ja.tutorial.explore.title",
            bodyKey: "module.study-language-ja.tutorial.explore.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "study.navigation",
        },
        {
            highlightNext: true,
            id: "practice",
            titleKey: "module.study-language-ja.tutorial.practice.title",
            bodyKey: "module.study-language-ja.tutorial.practice.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "study.modules",
        },
    ],
};
