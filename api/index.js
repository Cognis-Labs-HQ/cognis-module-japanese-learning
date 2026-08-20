import path from "node:path";
import { LanguageLibraryStore } from "./store.js";
import { readJson, sendJson } from "./reuse/http.js";

const LAYERS = new Set([
    "characters",
    "alt_characters",
    "definitions",
    "words",
    "sentences",
]);

function registerUi(ctx) {
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    const pages = [
        {
            id: "hiragana",
            path: "/study/hiragana",
            component: "hiragana-alphabet",
            access: "user",
            stylesheet: "hiragana.css",
        },
        {
            id: "library",
            path: "/study/library",
            component: "library",
            access: "admin",
            sharedStylesheet: "library-page.css",
        },
        {
            id: "classroom",
            path: "/study/ja-classroom",
            component: "classroom",
            access: "user",
            sharedStylesheet: "classroom-page.css",
        },
    ];
    for (const page of pages) {
        const componentBase = `/static/modules/study-language-ja/components/${page.component}/ui`;
        ctx.registerSpaRoute({
            id: `module-study-language-ja-${page.id}`,
            pattern: `^${page.path}$`,
            base: page.path,
            scriptUrl: `${componentBase}/app.js`,
            stylesheets: [
                ...(page.stylesheet
                    ? [`${componentBase}/${page.stylesheet}`]
                    : []),
                ...(page.sharedStylesheet
                    ? [
                          `/static/modules/study/languages/reuse/${page.sharedStylesheet}`,
                      ]
                    : []),
            ],
            access: { minRole: page.access },
        });
    }
    ctx.registerNavbarPlugin({
        scriptUrl: "/static/modules/study-language-ja/navbar.js",
        access: { minRole: "user" },
    });
}

function sendFailure(ctx, response, error, operation) {
    const clientError = ["invalid_json", "request_too_large"].includes(
        error.message,
    );
    ctx.log?.("error", "Japanese library request failed.", {
        component: "study-language-ja",
        operation,
        errorCode: clientError ? error.message : "library_write_failed",
    });
    sendJson(response, clientError ? 400 : 500, {
        error: {
            code: clientError ? error.message : "library_write_failed",
            message: clientError
                ? "The request body is invalid."
                : "The library could not be updated.",
        },
    });
}

export async function registerApi(ctx) {
    const requireAuth = ctx.getCapability("auth:requireAuth");
    if (typeof requireAuth !== "function") {
        throw new Error("Cognis Japanese requires auth:requireAuth.");
    }
    const store = new LanguageLibraryStore({
        moduleRoot: ctx.moduleRoot,
        languageCode: "ja",
        altCharactersFileName: "kanji",
        log: ctx.log,
    });
    await store.initialise();
    const basePath = "/api/v1/study/languages/ja/library";

    ctx.router.get(
        `${basePath}/snapshot`,
        async (request, response) => {
            await requireAuth(request, response, "user");
            if (!response.writableEnded)
                sendJson(response, 200, { data: store.snapshot() });
        },
        { access: { minRole: "user" } },
    );

    for (const layer of LAYERS) {
        const layerPath = `${basePath}/${layer}`;
        ctx.router.get(
            layerPath,
            async (request, response) => {
                await requireAuth(request, response, "user");
                if (response.writableEnded) return;
                const requestUrl = new URL(request.url, "http://localhost");
                sendJson(response, 200, {
                    data: store.queryLayer(
                        layer,
                        Object.fromEntries(requestUrl.searchParams),
                    ),
                });
            },
            { access: { minRole: "user" } },
        );

        ctx.router.post(
            layerPath,
            async (request, response) => {
                await requireAuth(request, response, "admin");
                if (response.writableEnded) return;
                try {
                    const body = await readJson(request);
                    if (
                        !body.record ||
                        typeof body.record !== "object" ||
                        Array.isArray(body.record)
                    ) {
                        sendJson(response, 400, {
                            error: {
                                code: "invalid_record",
                                message: "A record object is required.",
                            },
                        });
                        return;
                    }
                    const record = await store.addRecord(layer, body.record);
                    ctx.log?.("info", "Japanese library record created.", {
                        component: "study-language-ja",
                        operation: "create_record",
                        layer,
                        recordId: record.id,
                    });
                    sendJson(response, 201, { data: record });
                } catch (error) {
                    sendFailure(ctx, response, error, "create_record");
                }
            },
            { access: { minRole: "admin" } },
        );
    }

    registerUi(ctx);
    return store;
}
