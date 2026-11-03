export const definition = {
    moduleId: "study-language-ja",
    language: "ja",
    version: 1,
    id: "introduction",
    titleKey: "module.study-language-ja.tutorial.title",
    steps: [
        {
            id: "welcome",
            titleKey: "module.study-language-ja.tutorial.welcome.title",
            bodyKey: "module.study-language-ja.tutorial.welcome.body",
            effects: {
                callout: true,
                arrow: false,
                spotlight: false,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            route: "overview",
        },
        {
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
            route: "explore",
            target: "study.navigation",
        },
        {
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
            route: "flashcards",
            target: "workspace",
        },
    ],
};
