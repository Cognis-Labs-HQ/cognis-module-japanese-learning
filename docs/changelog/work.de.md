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

## Commits

- [7bbb383](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7bbb3839f238ccdb5a3eba48448405f561f3d328)
- [83ad282](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/83ad282d4289f885518a26b13776fcdd9f3a0f98)
