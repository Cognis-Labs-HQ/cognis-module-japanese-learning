# Bereichsbezogene Study-Bibliothek

**Feature Branch:** work

## Mehrschichtige Bibliothek

Die Bibliothek aus Paketdateien wurde durch die datenbankgestützte Study-Bibliothek aus Cognis PR #196 ersetzt. Sie bietet neun validierte Ebenen, Referenzverfolgung, bereichsbezogenen Zugriff, JSON- und Anki-Austausch sowie geprüfte Push-Anfragen.

## Bibliotheksbrowser

Die lokalisierte Bibliotheksseite wurde aktualisiert, um gefüllte globale Ebenen mit dem Seiten-Composer des Hosts zu durchsuchen.

## Auswählbare Vorlagen

Verbraucher können nur die benötigten Ebenen der kanonischen Bibliotheksvorlage kopieren. Beziehungsmetadaten erhalten gültige Verknüpfungen und erforderliche Abhängigkeiten, während bei der Erstellung von Wörtern und Sätzen passende Verknüpfungen abgeleitet werden können.

## Moduleigene API-Routen

Alle Bibliotheksendpunkte wurden in den moduleigenen API-Namensraum verschoben, damit Cognis das Modul aktivieren kann, ohne geschützte Routen des Study-Gateways abzulehnen.

## Lokalisierte Study-Navigation

Die japanische Study-Unternavigation wurde auf der Bibliotheksseite wiederhergestellt, alle drei Bezeichnungen der Unterseiten werden aus dem Modul-Bündel lokalisiert und Klicks werden auf jeder japanischen Study-Seite über den Cognis-Host-Router geleitet.

## Deklaratives japanisches Inhaltspaket

Das Modul wurde an den überarbeiteten Cognis-Library-2.1-Vertrag angepasst. Japanische Daten werden nun als versioniertes Schema und deklarativer Inhaltsgraph geliefert und über `study:library` übernommen. Validierung, Persistenz, Routen und generierte UI gehören dem Host; daher wurden der duplizierte Bibliotheksdienst, die Datenbank, APIs und Seiten des Moduls entfernt.

## Fähigkeitsbasierte Bibliotheksabhängigkeit

Die UUID des Bibliotheksadapters wurde aus den Komponentenabhängigkeiten entfernt, da Study-Adapter keine eigenständig installierbaren Komponenten sind. Das Modul hängt nun vom Study-Gateway ab und erkennt die Bibliothek ausschließlich über die erforderliche Fähigkeit `study:library`.

## Portable Inhaltskennungen

Kanji-Zeichen in Datensatz-IDs wurden durch stabile ASCII-Kennungen ersetzt, während die Zeichen als Bezeichnungen erhalten bleiben. Anschließend wurden Paketversion und Inhaltsrevision erhöht, damit die korrigierten Bytes sicher übernommen werden können.

## Sprachbezogene generierte Navigation

Die deklarative japanische Beschreibung wurde an Cognis PR #196 und #213 angepasst und deklariert ausdrücklich keine ausführbaren Unterseiten. Study stellt nun das generierte, für Lernende sichtbare Bibliotheksziel bereit und erhält den validierten Sprachkontext `ja` beim Browsen und in der Verlaufnavigation.

## Versionierter neutraler Schemavertrag

Die Anpassung an Cognis PR #214 ergänzt Namensraumeigentum, lokalisierte Schemametadaten, semantische Ebenenrollen, erweiterte Feldtypen, Detailhinweise, Aktivitäts- und Interessens-Tags, erforderliche Beziehungsziele, ausdrückliches Löschverhalten, Resolver-Rollen und streng positionierte geordnete Referenzen. Die Sprachbeschreibung veröffentlicht nun die unveränderliche Paketidentität.

## Strikte Kleinbuchstaben-IDs für Inhalte

Die Katakana-Datensatz-IDs verwenden jetzt ausschließlich kleingeschriebene ASCII-Zeichen, sodass der Host jeden Datensatz akzeptiert, statt die Aktivierung mit `invalid_content_record` abzubrechen. Paketversion und Inhaltsrevision wurden erhöht, damit Cognis die korrigierten Daten erneut einliest.

## Commits

- [a6fa75d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a6fa75d15c478b1d8ef1930dcc3c5c29e3938b97)
- [33cf20c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/33cf20c040c55a177efe83fa6d14674491da2254)
- [ddd8464](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddd84646f1930ea660f469e4b1776219558e1e5b)
