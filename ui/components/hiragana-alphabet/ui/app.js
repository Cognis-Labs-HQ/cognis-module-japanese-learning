import { escapeHtml } from "/static/reuse/escape-html.js";
import { mountWhenDirect } from "/static/reuse/page-entry.js";
import { mountStudyAlphabetPage } from "/static/modules/study/languages/reuse/alphabet-page.js";
import { createI18n } from "/static/reuse/i18n.js";
import { enhanceJapaneseStudySubNavigation } from "/static/modules/study-language-ja/reuse/study-sub-navigation.js";

function chunkRows(rows, chunkSize) {
    const chunks = [];
    for (let index = 0; index < rows.length; index += chunkSize) {
        chunks.push(rows.slice(index, index + chunkSize));
    }
    return chunks;
}

function renderCharacterGrid(characters) {
    const rows = chunkRows(characters, 5);
    return rows
        .map(
            (row) => `
    <div class="hiragana-row">
      ${row
          .map(
              (character) => `
        <div class="hiragana-cell" data-character-id="${escapeHtml(character.id)}">
          <span class="hiragana-symbol">${escapeHtml(character.symbol)}</span>
          <span class="hiragana-romanization">${escapeHtml(character.romanization)}</span>
        </div>
      `,
          )
          .join("")}
    </div>
  `,
        )
        .join("");
}

export async function mount(root, { signal } = {}) {
    await mountStudyAlphabetPage(root, {
        languageCode: "ja",
        fallbackLanguageCode: "ja",
        characterClass: "hiragana",
        pageElementId: "study-ja-hiragana",
        pageLabel: "Hiragana",
        preferenceKey: "study-ja-hiragana-layout",
        pageTitleKey: "gateway.study.hiragana_page_title",
        pageSubtitleKey: "gateway.study.hiragana_subtitle",
        renderSection: ({ i18n, alphabetCharacters }) => `
                    <section class="hiragana-alphabet-section">
                        <h2>${i18n.t("gateway.study.hiragana_section_heading")}</h2>
                        <p>${i18n.t("gateway.study.hiragana_description")}</p>
                        <div class="hiragana-grid">
                            ${renderCharacterGrid(alphabetCharacters)}
                        </div>
                    </section>
                `,
    });
    const i18n = await createI18n({
        componentStringBaseUrls: [
            "/static/modules/study-language-ja/languages",
        ],
    });
    enhanceJapaneseStudySubNavigation(root, i18n, { signal });
}
await mountWhenDirect(mount).catch((error) =>
    console.error("[study-ja] hiragana mount failed", error),
);
