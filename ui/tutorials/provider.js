import { definition } from "./plays.js";

/** The module owns its content text; Library owns UI targets, flows and cleanup. */
export async function mountProvider(ctx) {
    const library = ctx.capabilities.get("study:libraryTutorials");
    if (library?.version !== 1)
        throw new Error("library_tutorial_contract_unavailable");
    const { moduleId, ...guide } = definition;
    const registered = await library.register({
        ...guide,
        owner: `module.${moduleId}`,
        stringsBaseUrls: [`/static/modules/${moduleId}/languages`],
        signal: ctx.signal,
    });
    ctx.capabilities.contribute(`${moduleId}:tutorials`, registered);
    return registered.dispose;
}
