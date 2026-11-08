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
            "study.navigation": study.navigation,
            "study.languages": study.languages,
            "study.modules": study.modules,
        };
        const registered = await owner.register({
            ...play,
            automatic: false,
            page: ({ pathname }) => study.matchesPage({ pathname, language }),
            available: () =>
                ctx.capabilities.get("session:isAuthenticated")?.() === true &&
                study.isEnrolled(language) === true,
            requires: ["study:tutorialTargets"],
            steps: play.steps.map(({ target, ...step }) => ({
                ...step,
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
