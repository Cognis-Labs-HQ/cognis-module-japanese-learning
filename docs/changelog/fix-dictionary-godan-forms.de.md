# Godan-Verbformen ergänzen

**Feature-Zweig:** fix-dictionary-godan-forms

## Reguläre Verbformen auflösen

Reguläre japanische Godan-Verben auf ru, u, tsu und nu erhalten anbietereigene Formregeln und genaue Wörterbuchklassenzuordnungen. 帰る bietet beispielsweise 帰ります, 帰らない, 帰った und 帰って. Die besondere Flexion von ある bleibt getrennt. Die Inhaltsrevision aktualisiert das Bibliotheksschema beim Aktivieren.

## Explizite Transformationsflags verwenden

Japanische Basiskarten und Wörterbuchergebnisse deklarieren ausdrückliche Transformationsflags. Der kollektive Plural nutzt eine produktive, optionale Gruppe; 私 erzeugt 私たち ohne eigene Karte. Bestehende Regelpfade behalten ihre gebündelten Aufnahmen und generierten Zeichenmuster.

## Aufnahmen und Schreibübungen erhalten

Bestehende pfadgebundene Aufnahmen behalten die festgelegte japanische Stimme und das genaue Audio der Bestandteile. Abdeckungstests verlangen passende Aufnahmen für jede aktivierte Ausgangskarte und Regel, einschließlich neu hinzugefügter markierter Karten. Der Host löst Strichmuster aus der generierten Schreibweise auf.

Reguläre Godan-gu- und Suru-Regeln erfassen neue Wörterbuchverben. Suru nutzt geordnete Suffixalternativen für 勉強する und den nominalen Stamm 勉強, ohne eine zusätzliche Grundkarte anzulegen. Genaue Schreibweisen und Lesungen werden für Höflichkeits-, Verneinungs-, Vergangenheits-, Te-, Möglichkeits- und verkettete Kausativformen geprüft.

## Commits

- [5b21f1d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5b21f1d569cac8d037c0c62503c96839d2e5056f)
- [4233c508](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4233c508ff1357283bcb523b810adf076308a3ed)
