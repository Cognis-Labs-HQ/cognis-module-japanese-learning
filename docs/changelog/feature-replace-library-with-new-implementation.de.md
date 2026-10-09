# Optionale JLPT-Filter

**Feature Branch:** feature-replace-library-with-new-implementation

## JLPT-Stufen frei auswählen

Der JLPT-Filter beginnt jetzt ohne ausgewählte Stufe und erlaubt wie der optionale Verbtypfilter mehrere Auswahlen. Ohne ausgewählte Stufe werden alle Vokabelkarten angezeigt, einschließlich Karten ohne JLPT-Stufe.

## Paketrevision

Schemarevision 87 und Modul-/Inhaltspaketversion 2.2.83 veröffentlichen die geänderte Auswahlregel über den bestehenden Study-Library-Vertrag.

## Vollständige Jisho-Ergebnisse

Der Jisho-Anbieter liefert alle Aussprachen mit geordneten Kana-Gruppen, eine importierbare Definition je Bedeutung, lexikalische Klassifikation, JLPT-/Häufigkeitstags und die Quell-URL. Über die Registrierung bei `study:library:provider` deklariert er die Wörterbuchfähigkeit. Vollständige Quelldatensätze einschließlich Schreibvarianten, Wortarten, Bedeutungsnotizen, Einschränkungen, Dialekten, verwandten Begriffen und Herkunft werden als JSON im optionalen verborgenen Schemafeld `dictionary_data` gespeichert.

Ein Treffer füllt den geöffneten Editor; mehrere Treffer erscheinen zur Auswahl und Bestätigung in einer horizontalen Vorschau. Vokabelabfragen erhalten den eingegebenen Text und die Komposition. Lesungen und Definitionen werden sofort übernommen. Jede Bedeutung, auch durch Semikolon getrennte Angaben, wird eine eigene Definition. Fehlende UI-Sprachen ergänzt optional Cognis über die Lokalisierungsfähigkeit; das Modul erfindet keine Übersetzungen und kopiert kein Englisch in andere Sprachen. Quell-URLs und vollständige Originaldaten stehen ausschließlich in verborgenen `dictionary_data`-Metadaten.

Schemarevision 88 und Modul-/Inhaltspaketversion 2.2.84 veröffentlichen das Quelldatenfeld. Alle Bedeutungen können über die Host-Vorschau importiert oder innerhalb des Definitionslimits ausgewählt werden. Das vollständige Originalergebnis bleibt unabhängig von den verknüpften Bedeutungen gespeichert.

## Eigenständige Kanji-Suche

Kanji außerhalb der mitgelieferten Inhalte verwenden jetzt Jishos Kanji-Seite statt der Wort-API. Der Anbieter importiert Kun-/On-Lesungen, Bedeutungen, Strichzahl, Schulstufe, JLPT-Stufe und Häufigkeit. Lesetrennzeichen entfallen in der Aussprache; die Originalnotation bleibt in dictionary_data erhalten. Anbieterfehler werden als Suchfehler statt als leere Ergebnisse gemeldet. Der KanjiVG-Anbieter deklariert seine Strichmuster-Fähigkeit und das zugehörige Feld ausdrücklich. Modul-/Inhaltspaketversion 2.2.85 behält Schemarevision 88 bei.

## Identifizierte Jisho-Anfragen

Kanji- und Wortanfragen an Jisho senden jetzt einen beschreibenden Cognis-User-Agent. Damit werden die mit Nodes Standardkennung beobachteten HTTP-403-Antworten behoben, auch bei der Suche nach 教. Fehlerprotokolle enthalten einen sicheren Fehlercode und, sofern verfügbar, den HTTP-Status. Sie unterscheiden Ablehnung durch den Anbieter, ungültige Antwortformate und Übertragungsfehler, ohne Antwortinhalte aufzuzeichnen. Modul-/Inhaltspaketversion 2.2.86 behält Schemarevision 88 bei.

## Unsichtbare Wörterbuchherkunft

Jisho-Vorschläge speichern ihre genaue Quelladresse zusammen mit dem vollständigen Quelldatensatz im unsichtbaren Feld dictionary_data. Cognis importiert diese Metadaten direkt ohne sichtbare Quellenlinks oder Ergebnisfenster. Modul-/Inhaltspaketversion 2.2.87 behält Schemarevision 88 bei.

## Einzelne Wörterbuchbedeutungen

Jisho-Wortergebnisse liefern jede englische Bedeutung als eigene Definition, statt Bedeutungen durch Semikolon zusammenzufassen. Semikolons innerhalb einer gelieferten Bedeutung werden ebenfalls getrennt. Jede Definition erhält eine eigene Herkunftskennung; der verborgene Quelldatensatz behält alle Bedeutungen und Anbieterfelder. Modul und Inhaltspaket verwenden Version 2.2.88 bei Schemarevision 88.

## Aussprache aus dem Wörterbuch

Wörterbuchimporte lösen vollständige Aussprachen über die längsten vollständigen Treffer in installierte Kana auf. Zusammengesetzte Zeichen wie きょ und っく sowie wiederholte Positionen bleiben erhalten. Kanonische Eintragskennungen werden in geordneten Lesegruppen gespeichert; Lesungen mit fehlenden Zeichen werden nicht teilweise verknüpft. Definitionen verwenden passende Karten erneut oder erstellen Karten über den normalen Editorablauf. Karussells bleiben der wichtigste Weg zur Erstellung untergeordneter Karten. Zeichen und Partikeln bleiben schreibgeschützte, vom Anbieter verwaltete Ebenen. Satzeditoren bieten keine Wörterbuchsuche an.

## Alle Wörterbuchkandidaten

Ein Treffer füllt den geöffneten Editor; mehrere Treffer erscheinen zur Auswahl und Bestätigung in einer horizontalen Vorschau. Vokabelabfragen erhalten den eingegebenen Text und die Komposition. Lesungen und Definitionen werden sofort übernommen. Jede Bedeutung, auch durch Semikolon getrennte Angaben, wird eine eigene Definition. Fehlende UI-Sprachen ergänzt optional Cognis über die Lokalisierungsfähigkeit; das Modul erfindet keine Übersetzungen und kopiert kein Englisch in andere Sprachen. Quell-URLs und vollständige Originaldaten stehen ausschließlich in verborgenen `dictionary_data`-Metadaten.

## Wörterbuchsuche und Cache

Cognis Core besitzt den Wörterbuchcache über `core:cache`. Abfragen werden nach einer Stunde kalt und bei weiterer Nutzung geprüft. Änderungen werden an Zwölf-Stunden-Grenzen veröffentlicht; unveränderte Inhalte bleiben erhalten. Gleichzeitige Anfragen teilen eine Prüfung, fehlgeschlagene Prüfungen erhalten gültige Cache-Daten und der persistente Cache überlebt Neustarts. Module planen keine Wörterbuchabfragen und speichern keine Wörterbuchantworten. Jisho bietet keinen leichten Änderungsfeed; Prüfungen benötigen normale Suchantworten. Es gibt keine manuelle Aktualisierung. Lokale Links verwenden aktuell zugängliche Bibliothekskarten.

## Voraussetzungen für Satzimporte

Jishos Wort-API (`/api/v1/search/words`) liefert Wortformen, Lesungen, Bedeutungen, Markierungen und Wortarten. Eine Satzanfrage kann einzelne Wörter liefern, enthält aber keine Satzübersetzung, Tokenpositionen, Flexionszuordnung oder Partikelbindung. Beispielsatzsuche ist eine Korpussuche, keine Übersetzung beliebiger Eingaben. Zuverlässiger Ein-Klick-Import benötigt einen japanischen morphologischen Analysator mit Positionen, Grundformen, Wortarten und kontextuellen Lesungen, einen Übersetzungsanbieter und einen modulverwalteten Graphplaner für Cognis-Transformationen. Der Plan muss den ursprünglichen Satz samt Satzzeichen exakt rekonstruieren, Aussprachen mit vorhandenen Kana verknüpfen, vorhandene Wörter, Partikel und Zeichen bevorzugen und nur fehlende bearbeitbare Vokabeln oder Kanji samt Definitionen erzeugen. Zeichen und Partikel bleiben anbieterverwaltet. Der Host prüft Graph, Bereiche, Zugriffsrechte, Mehrdeutigkeit, Duplikate und atomare Rückabwicklung. Jisho ergänzt Wort- und Kanji-Knoten, stellt aber diese Verarbeitung nicht allein bereit. Eine Satzimportfunktion wird erst nach ihrer Implementierung angekündigt.

## Maßgebliche Suche

Wort- und Kanji-Anfragen beziehen maßgebliche Jisho-Daten auch bei Treffern im Inhaltspaket. Lokale Inhalte dienen nur als Ersatz, wenn Netzwerkabrufe ausdrücklich nicht verfügbar sind; Kana werden lokal durch den Anbieter aufgelöst. Die Einzelzeichen-Kanji-Suche liefert Kun-/On-Lesungen, Bedeutungen, Strichzahl, Schulstufe, JLPT und Häufigkeit. Anfragen verwenden einen Cognis-User-Agent, ein Zeitlimit von 15 Sekunden und sichere Fehlerprotokolle. Übertragungsfehler werden nicht als leere Treffer ausgegeben.

## Stabile Wörterbuchsuche

Jisho lädt auf Host-Anfragen aktuelle Wort- und Kanji-Daten. Exakte Wort- und Lesungstreffer stehen vor verwandten Treffern, bevorzugt in Kana geschriebene Einträge behalten diese Form, und reine Wikipedia-Titel werden ausgeschlossen. Fehlende Lesungen werden weder zu Definitionen noch zu erfundenen Aussprachen. Definitionen und Quelldaten bleiben getrennt; sämtliche Cacheregeln liegen bei Cognis.

Cognis Core verwaltet den Wörterbuchcache über `core:cache`. Eine gespeicherte Anfrage wird nach einer Stunde kalt; bei der nächsten Nutzung prüft Cognis den Anbieter auf Änderungen. Geänderte Ergebnisse bleiben bis zur Zwölf-Stunden-Grenze vorgemerkt, unveränderte Inhalte bleiben erhalten. Gleichzeitige Anfragen teilen eine Prüfung; fehlgeschlagene Prüfungen behalten das letzte erfolgreiche Ergebnis. Der Zustand übersteht Neustarts. Module laden Anbieterdaten, planen aber weder Anfragen noch eigene Antwortcaches. Jisho bietet keinen schlanken Änderungsfeed, daher benötigt eine Prüfung die normale Suchantwort. Es gibt keine manuelle Aktualisierungsschaltfläche. Aussprache- und Kartenlinks werden stets anhand aktuell zugänglicher Inhalte aufgelöst.

## Lesungsgraphen aus dem Wörterbuch

Wörterbuch-Quelldaten bleiben unsichtbare Metadaten in Formularen und Detailansichten. Importierte Aussprachen verwenden verborgene Vokabel-Lesungen im selben Bereich wie ihre übergeordnete Karte. Kanji mit mehreren Lesungen erhalten je einen verborgenen Datensatz mit Titelverweis zum Kanji und geordneten Kana-Verweisen; Kanji mit einer Lesung verweisen direkt auf Kana. Vollständige Wortlesungen verwenden verfügbare passende Kanji-Lesungssegmente und verbleibende Kana. Definitionen werden direkt mit den verborgenen Lesungen verknüpft. Cognis löst Anbieteridentitäten auf und speichert den Graphen atomar mit normaler Feld-, Ebenen-, Abhängigkeits- und ACL-Prüfung. Zeichen und Partikeln bleiben anbieterverwaltet. Redundante Katakana-Wiederholungen einer gleichwertigen Hiragana-Lesung werden herausgefiltert, sofern das Wörterbuch keine entsprechende Katakana-Schreibweise angibt; verbindliche On-Lesungen und echte Lehnwortlesungen bleiben erhalten.

## Validierte Operationsstufen

KanjiVG-Strichmuster verwenden einen getrennten, begrenzten Modulcache: höchstens 512 Bezeichnungen, erfolgreiche Antworten für 24 Stunden und fehlende Dateien für fünf Minuten. Gleichzeitige Abrufe teilen Anfragen; Fehler werden verworfen. Dieser Dateicache steuert weder Wörterbuchsuche noch Navigation. Jisho und KanjiVG nutzen den deterministischen Datenlader `reuse/content.js`; der Strichanbieter nutzt `reuse/lookup-cache.js`. Modul- und Inhaltspaketversion 2.2.93 behalten Schemarevision 88 bei. Jisho registriert sich über `study:library:provider` mit `searchable: true` und der Fähigkeit `dictionary`. Unterstützt werden Kana, Kanji und Vokabeln; Sätze und die Erstellung anbietereigener Partikel bleiben ausgeschlossen.

## Commits

- [f910563](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9105630f0ee87cad60fc67c99f46a311bcdb68b)
- [785fb21](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/785fb21beeb8addd3160e4dc46e0052f69a5efa1)
- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae
