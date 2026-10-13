export function registerConfigurationRoutes(ctx) {
    ctx.registerApiDelete(
        "/api/v1/modules/study-language-ja/config",
        (_request, response) => {
            response.writeHead(204);
            response.end();
        },
        { access: { minRole: "admin" }, allowWhenDisabled: true },
    );
}
