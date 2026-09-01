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

## Commits

- [8dc42b2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8dc42b26ee4c0fdf71e3b6e3961d2d5c22e60583)
- [9c0119a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9c0119a1f9b9cd4df94c4b941786698ca37a04c1)
