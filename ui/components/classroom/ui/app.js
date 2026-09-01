import { mountStudyClassroomPage } from "/static/modules/study/languages/reuse/classroom-page.js";
import { mountWhenDirect } from "/static/reuse/page-entry.js";
import { createI18n } from "/static/reuse/i18n.js";
import { enhanceJapaneseStudySubNavigation } from "/static/modules/study-language-ja/reuse/study-sub-navigation.js";

export async function mount(root, { signal } = {}) {
    await mountStudyClassroomPage(root, {
        signal,
        languageCode: "ja",
    });
    const i18n = await createI18n({
        componentStringBaseUrls: [
            "/static/modules/study-language-ja/languages",
        ],
    });
    enhanceJapaneseStudySubNavigation(root, i18n, { signal });
}

await mountWhenDirect(mount).catch((error) =>
    console.error("[study-ja] classroom mount failed", error),
);
