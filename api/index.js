import path from "node:path";
import { registerConfigurationRoutes } from "./routes/config/index.js";

export async function registerApi(ctx) {
    ctx.registerCapabilityProvider({
        scriptUrl: "/static/modules/study-language-ja/tutorials/provider.js",
        providesCapabilities: ["study-language-ja:tutorials"],
    });
    ctx.registerStaticDirectory("", path.join(ctx.moduleRoot, "ui"));
    return registerConfigurationRoutes(ctx);
}
