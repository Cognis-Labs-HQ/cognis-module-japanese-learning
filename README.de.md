# Cognis Japanisch

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanisch ist das externe Modul mit japanischen Lerninhalten für das Cognis-Study-Gateway. Es enthält die japanische Sprachbeschreibung, die Hiragana-Aktivität, den bereichsbezogenen Bibliotheksbrowser, den Unterrichtsbereich und japanische Lerndatensätze.

## Vorlagen für Verbraucher

Verbraucher rufen über die `study:library`-Fähigkeit `cloneTemplate` mit genau den benötigten Ebenen auf. Kopien behalten die kanonische Reihenfolge und Beziehungsmetadaten bei, entfernen Verknüpfungen zu ausgelassenen Ebenen und kennzeichnen erforderliche Abhängigkeiten. Beim Erstellen von Wörtern und Sätzen können Verknüpfungen aus normalisierten Zeichen und durch Leerraum getrennten Wörtern abgeleitet werden; ausdrückliche Referenzen bleiben maßgeblich.

## Voraussetzungen

- Cognis mit aktiviertem Study-Gateway.
- Die Host-Capability `auth:requireAuth`.
- Ein Administrator- oder Eigentümerkonto, um Bibliothekseinträge zu ändern.

## Entwicklung

```sh
npm install
npm test
npm run check:manifest
```

Das Modul registriert `/study/hiragana`, `/study/library` und `/study/ja-classroom`. Seine authentifizierte, mehrschichtige Bibliotheks-API ist unter `/api/v1/modules/study-language-ja/study/library` verfügbar und unterstützt globale, Klassen- und Benutzerbereiche, Abhängigkeitsverfolgung, JSON- und Anki-Austausch sowie geprüfte Push-Anfragen.

Das Manifest veröffentlicht `/static/modules/study-language-ja/languages` als moduleigenes Sprachpaket, damit Cognis Marketplace-Metadaten vor dem Laden der UI übersetzen kann.

Dieses Repository wurde aus dem Japanisch-Sprachmodul im Cognis-Branch `feature-remove-modules-from-administration-page` extrahiert und folgt der externen Modulpaketierung von [Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) und [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1).

## Lizenz

AGPL-3.0-or-later. Siehe [LICENSE](LICENSE).
