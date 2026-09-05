# Cognis Japanisch

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanisch ist ein deklaratives japanisches Inhaltspaket für die Cognis-Study-Bibliothek. Es liefert ein versioniertes Schema sowie validierte Zeichen-, Definitions-, Wort- und Satzdatensätze, ohne API-Routen, Persistenz oder Browseroberflächen zu besitzen.

## Voraussetzungen

- Cognis mit aktiviertem Study-Gateway und Bibliotheksadapter.
- Die Host-Fähigkeit `study:library`.

Das externe Modul deklariert das Study-Gateway als Komponentenabhängigkeit. Es erkennt den Bibliotheksadapter über die erforderliche Fähigkeit `study:library`, statt die Adapter-UUID als eigenständig installierbare Komponente zu behandeln.

## Entwicklung

```sh
npm install
npm test
npm run check:manifest
```

Beim Bootstrap bezieht das Modul `study:library` über `ctx` und ruft `ingestContentPack` für `data/library` auf. Cognis übernimmt Pfadsicherheit, Graphvalidierung, stabile interne IDs, Transaktionen, Idempotenz, Persistenz, API-Routen und schemagenerierte Study-Oberflächen.

Das Inhaltspaketmanifest erfasst Herausgeber, unveränderliche Paketversion, Inhaltsrevision, Schema- und Inhaltspfade sowie die Lizenz. `schema.json` deklariert japanische Ebenen, typisierte Felder, Beziehungen, Kardinalität, Reihenfolge und Resolver. Inhaltsdateien verwenden stabile paketlokale IDs und ausdrückliche Referenzen.

Das externe Modulmanifest veröffentlicht `/static/modules/study-language-ja/languages`, damit Cognis Marketplace-Metadaten vor dem Modul-Bootstrap übersetzen kann.
