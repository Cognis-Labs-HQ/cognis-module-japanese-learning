import { definition } from "./plays.js";

/** Language knowledge stays local; Study resolves navigation through its public contract. */
export async function mountProvider(ctx) {
    const api = ctx.capabilities.get("ui:tutorials");
    if (api?.version !== 1) throw new Error("tutorial_contract_unavailable");
    const { moduleId, language, ...play } = definition;
    const owner = api.owner(`module.${moduleId}`, {
        signal: ctx.signal,
        stringsBaseUrls: [`/static/modules/${moduleId}/languages`],
    });
    try {
        const study = ctx.capabilities.get("study:tutorialTargets");
        if (!study) throw new Error("study_tutorial_targets_unavailable");
        const targets = {
            workspace: "ui.workspace:workspace",
            "study.navigation": study.navigation,
        };
        const registered = await owner.register({
            ...play,
            available: () =>
                ctx.capabilities.get("session:isAuthenticated")?.() === true,
            requires: [
                "ui:navigate",
                "study:tutorialTargets",
                "study:library:client",
            ],
            steps: play.steps.map(({ route: area, target, ...step }) => ({
                ...step,
                route: () => study.route({ language, area }),
                ...(target ? { target: targets[target] } : {}),
            })),
        });
        ctx.capabilities.contribute(`${moduleId}:tutorials`, registered);
        return owner.dispose;
    } catch (error) {
        owner.dispose();
        throw error;
    }
}
