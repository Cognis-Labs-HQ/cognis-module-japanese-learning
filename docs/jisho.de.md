# Vollständige Jisho-Ergebnisse

Der Jisho-Anbieter liefert alle Aussprachen mit geordneten Kana-Gruppen, eine importierbare Definition je Bedeutung, lexikalische Klassifikation, JLPT-/Häufigkeitstags und die Quell-URL. Über die Registrierung bei `study:library:provider` deklariert er die Wörterbuchfähigkeit. Vollständige Quelldatensätze einschließlich Schreibvarianten, Wortarten, Bedeutungsnotizen, Einschränkungen, Dialekten, verwandten Begriffen und Herkunft werden als JSON im optionalen verborgenen Schemafeld `dictionary_data` gespeichert.

## Verwendung

Cognis PR #226 ergänzt die allgemeine Ergebnisvorschau, den Definitionsimport und die Aktion für fehlende Übersetzungen. Anbieter liefern echte Quellübersetzungen; Cognis fordert Deutsch, Englisch, Indonesisch und Japanisch über seine optionale Lokalisierungsfähigkeit an. Das Modul erfindet keine Übersetzungen und kopiert Englisch nicht in andere Sprachen. Lokale Inhalte werden weiterhin vor dem Netzwerk geprüft; Klassifikation und Tags bleiben nun erhalten.

## Technische Spezifikation

Schemarevision 88 und Modul-/Inhaltspaketversion 2.2.84 veröffentlichen das Quelldatenfeld. Alle Bedeutungen können über die Host-Vorschau importiert oder innerhalb des Definitionslimits ausgewählt werden. Das vollständige Originalergebnis bleibt unabhängig von den verknüpften Bedeutungen gespeichert.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)

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
