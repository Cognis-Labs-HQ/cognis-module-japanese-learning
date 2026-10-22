# Godan-Verbformen ergänzen

**Feature-Zweig:** fix-dictionary-godan-forms

## Reguläre Verbformen auflösen

Reguläre japanische Godan-Verben auf ru, u, tsu und nu erhalten anbietereigene Formregeln und genaue Wörterbuchklassenzuordnungen. 帰る bietet beispielsweise 帰ります, 帰らない, 帰った und 帰って. Die besondere Flexion von ある bleibt getrennt. Die Inhaltsrevision aktualisiert das Bibliotheksschema beim Aktivieren.

## Explizite Transformationsflags verwenden

Japanische Basiskarten und Wörterbuchergebnisse deklarieren ausdrückliche Transformationsflags. Der kollektive Plural nutzt eine produktive, optionale Gruppe; 私 erzeugt 私たち ohne eigene Karte. Bestehende Regelpfade behalten ihre gebündelten Aufnahmen und generierten Zeichenmuster.

## Aufnahmen und Schreibübungen erhalten

Bestehende pfadgebundene Aufnahmen behalten die festgelegte japanische Stimme und das genaue Audio der Bestandteile. Abdeckungstests verlangen passende Aufnahmen für jede aktivierte Ausgangskarte und Regel, einschließlich neu hinzugefügter markierter Karten. Der Host löst Strichmuster aus der generierten Schreibweise auf.

Reguläre Godan-gu- und Suru-Regeln erfassen neue Wörterbuchverben. Suru nutzt geordnete Suffixalternativen für 勉強する und den nominalen Stamm 勉強, ohne eine zusätzliche Grundkarte anzulegen. Genaue Schreibweisen und Lesungen werden für Höflichkeits-, Verneinungs-, Vergangenheits-, Te-, Möglichkeits- und verkettete Kausativformen geprüft.

## Satzwortschatz auffindbar halten

Satzstruktur-Karussells deklarieren ausdrücklich `excludeFromBrowse: false`, damit ihre lexikalischen Wörter auch im Wortschatz erscheinen. Reine Satzzeichen-Karussells bleiben ausgeschlossen. Tests prüfen alle Wortschatzreferenzen der Sätze, ausgeblendete Aussprache-Aliase und optionale Filter, einschließlich nicht eingestufter Wörter wie ノート im Japanischen.

## Aussagekräftige Merkmale und JLPT-Filter

Lernmerkmale zeigen lokalisierte Wortarten, häufige Verwendung und JLPT-Stufen; technische Form- und Transformationstags bleiben intern. Für 225 Vokabeln und 190 Kanji liegen quellengestützte Stufen vor. Nicht gelistete oder mehrdeutige Einträge bleiben unklassifiziert. Das mitgelieferte Verzeichnis dokumentiert Jisho-Belege, gleicht Aussprache und Bedeutung ab und verwendet bei mehreren Listen die früheste Lernstufe.

Kanji und Sätze bieten dieselben kompakten N5–N1-Filter wie der Wortschatz, ohne automatische Anfangsauswahl. Die geschätzte Satzstufe entspricht der schwierigsten referenzierten Vokabel, Grundpartikel oder gewählten Transformation; ein gespeicherter Wert kann eine grammatische Mindeststufe festlegen. Ein Satz muss die gewählte Stufe und keine schwierigere Anforderung enthalten. Bei fehlenden Einstufungen bleibt er unklassifiziert und in der ungefilterten Ansicht sichtbar. Grammatikstufen sind anbietereigene Lernziele und keine offizielle JLPT-Zertifizierung.

## Commits

- [5b21f1d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5b21f1d569cac8d037c0c62503c96839d2e5056f)
- [4233c508](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4233c508ff1357283bcb523b810adf076308a3ed)
- [4cd4b1cb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4cd4b1cb4c630b41ed6c577dfb159a4d6caa2566)
- [31035eeb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/31035eeb63b25a5f20bf3f507cd6d37c3a5adcfb)
