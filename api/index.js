import path from "node:path";
import { registerDisabledApiRoutes } from "./routes/config/index.js";

export async function registerApi(ctx) {
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    return registerDisabledApiRoutes(ctx);
}
