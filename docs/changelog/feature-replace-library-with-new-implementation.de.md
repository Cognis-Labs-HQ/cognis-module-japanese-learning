# Optionale JLPT-Filter

**Feature Branch:** feature-replace-library-with-new-implementation

## JLPT-Stufen frei auswählen

Der JLPT-Filter beginnt jetzt ohne ausgewählte Stufe und erlaubt wie der optionale Verbtypfilter mehrere Auswahlen. Ohne ausgewählte Stufe werden alle Vokabelkarten angezeigt, einschließlich Karten ohne JLPT-Stufe.

## Paketrevision

Schemarevision 87 und Modul-/Inhaltspaketversion 2.2.83 veröffentlichen die geänderte Auswahlregel über den bestehenden Study-Library-Vertrag.

## Vollständige Jisho-Ergebnisse

Der Jisho-Anbieter liefert alle Aussprachen mit geordneten Kana-Gruppen, eine importierbare Definition je Bedeutung, lexikalische Klassifikation, JLPT-/Häufigkeitstags und die Quell-URL. Über die Registrierung bei `study:library:provider` deklariert er die Wörterbuchfähigkeit. Vollständige Quelldatensätze einschließlich Schreibvarianten, Wortarten, Bedeutungsnotizen, Einschränkungen, Dialekten, verwandten Begriffen und Herkunft werden als JSON im optionalen verborgenen Schemafeld `dictionary_data` gespeichert.

Cognis PR #226 ergänzt die allgemeine Ergebnisvorschau, den Definitionsimport und die Aktion für fehlende Übersetzungen. Anbieter liefern echte Quellübersetzungen; Cognis fordert Deutsch, Englisch, Indonesisch und Japanisch über seine optionale Lokalisierungsfähigkeit an. Das Modul erfindet keine Übersetzungen und kopiert Englisch nicht in andere Sprachen. Lokale Inhalte werden weiterhin vor dem Netzwerk geprüft; Klassifikation und Tags bleiben nun erhalten.

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

Der Jisho-Anbieter liefert nun alle verwendbaren Worttreffer mit jeweils eigenem kanonischem Namen, Lesungen, Definitionen, Wortklasse, Schlagwörtern, Beziehungen und verborgenen Quelldaten. Cognis lässt mehrere Treffer vor der Übernahme auswählen und bestätigen. Lokale Treffer werden weiterhin vor der Netzwerksuche verwendet; die Kanji-Suche bleibt eine Anfrage für ein einzelnes Zeichen. Modul und Inhaltspaket verwenden Version 2.2.89 bei Schemarevision 88.

## Wörterbuchsuche und Cache

Wörterbuchanbieter aktivieren die Navigationssuche mit `searchable: true` und der Fähigkeit `dictionary`. Gesucht wird nur in unterstützten Ebenen mit erlaubter Wörterbuchsuche; Sätze bleiben ausgeschlossen. Die eigene Suchergebnisseite zeigt Kartenvorschauen und alle Definitionen, verbirgt Quelldaten und öffnet für bewusste Importe den normalen Karteneditor. Cognis speichert Ergebnisse nach Anbieter, Schemaversion und normalisierter Anfrage für 24 Stunden, bündelt gleichzeitige Anfragen und erhält den Cache über Neustarts. Aktualisieren fragt den Anbieter erneut ab. Lokale Karten und Ausspracheverknüpfungen werden anhand der aktuell zugänglichen Library aufgelöst. Jisho bietet keinen inkrementellen Änderungsfeed; neue Einträge werden durch Aktualisierung oder Ablauf entdeckt.

## Voraussetzungen für Satzimporte

Jishos Wort-API (`/api/v1/search/words`) liefert Wortformen, Lesungen, Bedeutungen, Markierungen und Wortarten. Eine Satzanfrage kann einzelne Wörter liefern, enthält aber keine Satzübersetzung, Tokenpositionen, Flexionszuordnung oder Partikelbindung. Beispielsatzsuche ist eine Korpussuche, keine Übersetzung beliebiger Eingaben. Zuverlässiger Ein-Klick-Import benötigt einen japanischen morphologischen Analysator mit Positionen, Grundformen, Wortarten und kontextuellen Lesungen, einen Übersetzungsanbieter und einen modulverwalteten Graphplaner für Cognis-Transformationen. Der Plan muss den ursprünglichen Satz samt Satzzeichen exakt rekonstruieren, Aussprachen mit vorhandenen Kana verknüpfen, vorhandene Wörter, Partikel und Zeichen bevorzugen und nur fehlende bearbeitbare Vokabeln oder Kanji samt Definitionen erzeugen. Zeichen und Partikel bleiben anbieterverwaltet. Der Host prüft Graph, Bereiche, Zugriffsrechte, Mehrdeutigkeit, Duplikate und atomare Rückabwicklung. Jisho ergänzt Wort- und Kanji-Knoten, stellt aber diese Verarbeitung nicht allein bereit. Eine Satzimportfunktion wird erst nach ihrer Implementierung angekündigt.

## Commits

- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6

## Verbindliche Suche und Aktualisierung

Wort- und Kanji-Suchen laden vollständige Jisho-Datensätze auch bei Treffern in den mitgelieferten Inhalten. Kana werden weiterhin lokal vom Inhaltsanbieter aufgelöst. Mitgelieferte Inhalte sind verfügbar, wenn der Netzwerkabruf ausdrücklich nicht verfügbar ist. Wort- und Kanji-Anfragen verwenden dieselbe begrenzte Cachefunktion mit Ablaufzeit; eine fehlgeschlagene ältere Anfrage kann kein neueres aktualisiertes Ergebnis entfernen.

- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae
