import { Configuration } from "../../configuration.js";

export async function registerDisabledApiRoutes(ctx) {
    const configuration = new Configuration(ctx.getCapability("db:executor"));
    await configuration.load();
    const operations = {
        Get: () => configuration.value,
        Put: (value) => configuration.save(value),
        Delete: () => configuration.clear(),
    };
    for (const [method, operation] of Object.entries(operations)) {
        const id =
            "study-language-ja:" +
            {
                Get: "readConfiguration",
                Put: "saveConfiguration",
                Delete: "clearConfiguration",
            }[method];
        ctx.registerFlow({ id, stages: ["validate", "persist"] });
        ctx.flow.extend(
            id,
            "validate",
            { id: `${id}:validate` },
            ({ input }) => {
                if (
                    method === "Put" &&
                    (!input ||
                        typeof input.voiceId !== "string" ||
                        (input.voiceId &&
                            !/^[a-zA-Z0-9_-]{1,128}$/.test(input.voiceId)))
                )
                    throw new Error("invalid_voice_id");
            },
        );
        ctx.flow.extend(
            id,
            "persist",
            { id: `${id}:persist` },
            async ({ input, data }) => {
                data.result = await operation(input);
            },
        );
        ctx[`registerApi${method}`](
            "/api/v1/modules/study-language-ja/config",
            async (request, response) => {
                try {
                    let input;
                    if (method === "Put") {
                        let size = 0;
                        const chunks = [];
                        for await (const chunk of request) {
                            size += Buffer.byteLength(chunk);
                            if (size > 2048)
                                throw new Error("invalid_voice_id");
                            chunks.push(Buffer.from(chunk));
                        }
                        input = JSON.parse(
                            Buffer.concat(chunks).toString("utf8"),
                        );
                    }
                    const result = await ctx.flow.run(id, input);
                    if (method !== "Get")
                        ctx.log?.("info", "Study voice configuration saved.", {
                            component: "study-language-ja",
                            operation: id,
                        });
                    response.writeHead(200, {
                        "content-type": "application/json",
                    });
                    response.end(
                        JSON.stringify({ data: result.data.result ?? {} }),
                    );
                } catch (error) {
                    ctx.log?.("error", "Study voice configuration failed.", {
                        component: "study-language-ja",
                        operation: id,
                        errorName:
                            error instanceof Error ? error.name : "Error",
                    });
                    response.writeHead(
                        error.message === "invalid_voice_id" ||
                            error instanceof SyntaxError
                            ? 400
                            : 500,
                        { "content-type": "application/json" },
                    );
                    response.end(
                        JSON.stringify({
                            error: { code: "configuration_failed" },
                        }),
                    );
                }
            },
            { access: { minRole: "admin" }, allowWhenDisabled: true },
        );
    }
    return configuration;
}
