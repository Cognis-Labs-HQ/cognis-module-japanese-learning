import { navigateTo } from "/static/reuse/app-router.js";
import { escapeHtml } from "/static/reuse/escape-html.js";

const JAPANESE_STUDY_PAGES = [
    {
        path: "/study/hiragana",
        labelKey: "module.study-language-ja.hiragana",
    },
    {
        path: "/study/library",
        labelKey: "module.study-language-ja.library",
    },
    {
        path: "/study/ja-classroom",
        labelKey: "module.study-language-ja.classroom",
    },
];

function labelByPath(i18n) {
    return new Map(
        JAPANESE_STUDY_PAGES.map(({ path, labelKey }) => [
            path,
            i18n.t(labelKey),
        ]),
    );
}

export function renderJapaneseStudySubNavigation(i18n, currentPath) {
    return `
        <div class="study-page-subnav" data-study-language-ja-subnav>
            <ul class="page-subnav-list study-subnav-modules">
                ${JAPANESE_STUDY_PAGES.map(({ path, labelKey }) => {
                    const label = i18n.t(labelKey);
                    const activeClass = path === currentPath ? " active" : "";
                    return `
                        <li>
                            <a class="study-subnav-link study-subnav-module-link${activeClass}" href="${escapeHtml(path)}" data-search-category="Pages" data-search-label="${escapeHtml(label)}">
                                ${escapeHtml(label)}
                            </a>
                        </li>
                    `;
                }).join("")}
            </ul>
        </div>
    `;
}

export function enhanceJapaneseStudySubNavigation(root, i18n, { signal } = {}) {
    const labels = labelByPath(i18n);
    for (const link of root.querySelectorAll(".study-subnav-module-link")) {
        const linkUrl = new URL(link.href, window.location.origin);
        const label = labels.get(linkUrl.pathname);
        if (!label) continue;
        link.textContent = label;
        link.dataset.searchLabel = label;
    }
    root.addEventListener(
        "click",
        (event) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }
            const link = event.target.closest(
                "[data-study-language-ja-subnav] a[href], .study-subnav-module-link[href]",
            );
            if (!link || !root.contains(link)) return;
            const linkUrl = new URL(link.href, window.location.origin);
            if (linkUrl.origin !== window.location.origin) return;
            event.preventDefault();
            void navigateTo(
                `${linkUrl.pathname}${linkUrl.search}${linkUrl.hash}`,
            );
        },
        { signal },
    );
}
