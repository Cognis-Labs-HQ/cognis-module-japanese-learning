import path from "node:path";
import { LibraryService } from "./library/service.js";
import { LibraryStore } from "./library/store.js";
import { readJson, sendJson } from "./reuse/http.js";

export const LIBRARY_API_BASE =
    "/api/v1/modules/study-language-ja/study/library";

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
            access: "user",
            stylesheet: "library.css",
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

function locationFrom(requestUrl) {
    const scope = requestUrl.searchParams.get("scope") ?? "global";
    if (!["global", "class", "user"].includes(scope))
        throw new Error("invalid_scope");
    return {
        scope,
        scopeId: requestUrl.searchParams.get("scopeId") ?? undefined,
    };
}

function actorFrom(claims, request) {
    const resolvedClaims = claims ?? request.auth ?? request.user;
    if (!resolvedClaims?.sub || !resolvedClaims?.role)
        throw new Error("invalid_auth_context");
    return { accountId: resolvedClaims.sub, role: resolvedClaims.role };
}

function failureStatus(code) {
    if (code === "forbidden") return 403;
    if (code === "not_found") return 404;
    return 400;
}

function registerRoutes(ctx, requireAuth, library) {
    const basePath = LIBRARY_API_BASE;
    const route = (method, routePath, operation, handler, access = "user") => {
        ctx.router[method](
            routePath,
            async (request, response) => {
                const claims = await requireAuth(request, response, access);
                if (response.writableEnded) return;
                let actor;
                try {
                    actor = actorFrom(claims, request);
                    await handler(request, response, actor);
                } catch (error) {
                    const code =
                        error instanceof Error
                            ? error.message
                            : "request_failed";
                    ctx.log?.("error", "Japanese library request failed.", {
                        component: "study-language-ja",
                        operation,
                        accountId: actor?.accountId,
                        code,
                    });
                    sendJson(response, failureStatus(code), {
                        error: {
                            code,
                            message: "Library request could not be completed.",
                        },
                    });
                }
            },
            { access: { minRole: access } },
        );
    };

    route("get", `${basePath}/layers`, "list_layers", (_request, response) =>
        sendJson(response, 200, { data: library.layers }),
    );
    route(
        "get",
        `${basePath}/entries`,
        "list_entries",
        async (request, response, actor) => {
            const requestUrl = new URL(request.url, "http://localhost");
            sendJson(response, 200, {
                data: await library.list(
                    actor,
                    locationFrom(requestUrl),
                    requestUrl.searchParams.get("layer") ?? undefined,
                ),
            });
        },
    );
    route(
        "post",
        `${basePath}/entries`,
        "create_entry",
        async (request, response, actor) => {
            const body = await readJson(request);
            const entry = await library.create(
                actor,
                body.location,
                body.entry,
            );
            ctx.log?.("info", "Japanese library entry created.", {
                component: "study-language-ja",
                operation: "create_entry",
                accountId: actor.accountId,
                entryId: entry.id,
            });
            sendJson(response, 201, { data: entry });
        },
    );
    route(
        "get",
        `${basePath}/entries/:entryId/trace`,
        "trace_entry",
        async (request, response, actor) =>
            sendJson(response, 200, {
                data: await library.trace(actor, request.params.entryId),
            }),
    );
    route(
        "post",
        `${basePath}/import`,
        "import_entries",
        async (request, response, actor) =>
            sendJson(response, 201, {
                data: await library.importJson(actor, await readJson(request)),
            }),
        "admin",
    );
    route(
        "get",
        `${basePath}/export`,
        "export_entries",
        async (request, response, actor) => {
            const requestUrl = new URL(request.url, "http://localhost");
            if (requestUrl.searchParams.get("format") === "anki") {
                response.writeHead(200, {
                    "content-type": "text/tab-separated-values; charset=utf-8",
                    "content-disposition":
                        'attachment; filename="cognis-library.txt"',
                });
                response.end(
                    await library.exportAnki(actor, locationFrom(requestUrl)),
                );
                return;
            }
            sendJson(
                response,
                200,
                await library.exportJson(actor, locationFrom(requestUrl)),
            );
        },
    );
    route(
        "post",
        `${basePath}/push-requests`,
        "request_push",
        async (request, response, actor) => {
            const body = await readJson(request);
            sendJson(response, 201, {
                data: await library.requestPush(
                    actor,
                    body.entryId,
                    body.destination,
                ),
            });
        },
    );
    route(
        "put",
        `${basePath}/push-requests/:requestId`,
        "review_push",
        async (request, response, actor) => {
            const body = await readJson(request);
            if (!["approved", "rejected"].includes(body.decision))
                throw new Error("invalid_decision");
            sendJson(response, 200, {
                data: await library.reviewPush(
                    actor,
                    request.params.requestId,
                    body.decision,
                ),
            });
        },
    );
}

export async function registerApi(ctx) {
    const requireAuth = ctx.getCapability("auth:requireAuth");
    const database = ctx.getCapability("db:executor");
    if (typeof requireAuth !== "function")
        throw new Error("Cognis Japanese requires auth:requireAuth.");
    if (!database) throw new Error("Cognis Japanese requires db:executor.");
    const store = new LibraryStore(database);
    await store.ensureSchema();
    const library = new LibraryService(
        store,
        ctx.getCapability("study:classes:access"),
    );
    registerRoutes(ctx, requireAuth, library);
    registerUi(ctx);
    return library;
}
