# Wörterbuchintegration

Jisho registriert sich über die Host-Funktion `study:library:provider` mit `searchable: true` und der Funktion `dictionary`. Unterstützt werden Kana, Kanji und Wortschatz; Sätze und anbietereigene Partikelerstellung sind ausgeschlossen. Modul-, Inhalts- und Schemametadaten stehen in den Manifesten.

## Maßgebliche Suche

Wort- und Kanji-Anfragen beziehen maßgebliche Jisho-Daten auch bei Treffern im Inhaltspaket. Lokale Inhalte dienen nur als Ersatz, wenn Netzwerkabrufe ausdrücklich nicht verfügbar sind; Kana werden lokal durch den Anbieter aufgelöst. Die Einzelzeichen-Kanji-Suche liefert Kun-/On-Lesungen, Bedeutungen, Strichzahl, Schulstufe, JLPT und Häufigkeit. Anfragen verwenden einen Cognis-User-Agent, ein Zeitlimit von 15 Sekunden und sichere Fehlerprotokolle. Übertragungsfehler werden nicht als leere Treffer ausgegeben.

## Import in den Editor

Ein Treffer füllt den geöffneten Editor; Treffer gleicher Zusammensetzung bündeln Lesungen und Bedeutungen. Andere Schreibweisen erscheinen in einer horizontalen Vorschau zur sofortigen Auswahl; Weiter behält die genaue Zusammensetzung. Vokabelabfragen erhalten den eingegebenen Text und die Komposition. Lesungen und Definitionen werden sofort übernommen. Jede Bedeutung, auch durch Semikolon getrennte Angaben, wird eine eigene Definition. Fehlende UI-Sprachen ergänzt optional Cognis über die Lokalisierungsfähigkeit; das Modul erfindet keine Übersetzungen und kopiert kein Englisch in andere Sprachen. Quell-URLs und vollständige Originaldaten stehen ausschließlich in verborgenen `dictionary_data`-Metadaten.

## Lesungsgraphen

Kanji mit mehreren Lesungen erhalten je eine verborgene Vokabel mit Rückverweis auf das Kanji, geordneten Kana-Lesungslinks und direkten Definitionen. Kanji mit einer Lesung verweisen direkt auf Kana. Wortlesungen bevorzugen vorhandene Kanji-Lesungssegmente und ergänzende Kana. Cognis löst installierte Identitäten auf, verwendet passende Zwischenkarten bei erneutem Import wieder und prüft Felder, Sichtbarkeit und ACLs vor der atomaren Speicherung. Zeichen und Partikel bleiben anbietereigen. Redundante Katakana-Wiederholungen werden entfernt, sofern diese Schreibweise nicht ausdrücklich im Wörterbuch steht; echte On-Lesungen und Lehnwörter bleiben erhalten.

## Core besitzt den Cache

Cognis Core besitzt den Wörterbuchcache über `core:cache`. Abfragen werden nach einer Stunde kalt und bei weiterer Nutzung geprüft. Änderungen werden an Zwölf-Stunden-Grenzen veröffentlicht; unveränderte Inhalte bleiben erhalten. Gleichzeitige Anfragen teilen eine Prüfung, fehlgeschlagene Prüfungen erhalten gültige Cache-Daten und der persistente Cache überlebt Neustarts. Module planen keine Wörterbuchabfragen und speichern keine Wörterbuchantworten. Jisho bietet keinen leichten Änderungsfeed; Prüfungen benötigen normale Suchantworten. Es gibt keine manuelle Aktualisierung. Lokale Links verwenden aktuell zugängliche Bibliothekskarten.

## Cache für Strichdateien

KanjiVG-Strichmuster verwenden einen getrennten, begrenzten Modulcache: höchstens 512 Bezeichnungen, erfolgreiche Antworten für 24 Stunden und fehlende Dateien für fünf Minuten. Gleichzeitige Abrufe teilen Anfragen; Fehler werden verworfen. Dieser Dateicache steuert weder Wörterbuchsuche noch Navigation. Jisho und KanjiVG nutzen den deterministischen Datenlader `api/reuse/content.js`; der Strichanbieter nutzt `api/reuse/lookup-cache.js`.

## Grenzen des Satzimports

Jishos Wort-API liefert Formen, Lesungen, Bedeutungen und Wortarten, aber keine Übersetzung beliebiger Sätze, Tokenpositionen, Flexionszuordnung oder Partikelanbindung. Ein zuverlässiger Satzimport benötigt weiterhin eine morphologische Analyse, einen Übersetzungsanbieter und einen modulverwalteten Graphplaner, der Text, Satzzeichen und flektierte Lesungen erhält. Jisho kann lexikalische Knoten ergänzen, aber diese Pipeline nicht allein bereitstellen. Eine Satzimport-Fähigkeit wird nicht angeboten.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)

## Häufige Wörterbucheinträge

Bei gleich genauen Treffern stehen von Jisho mit is_common markierte Einträge vor seltenen Einträgen. Exakte Treffer bleiben vor verwandten Treffern. Jisho liefert keine Häufigkeit einzelner Bedeutungen: Definitionen behalten die ursprüngliche Reihenfolge, darunter room an erster Stelle für 室, statt vom Editor umgekehrt zu werden.

## Wörterbuchtransformationen

Transformationskarten richten Titel, Lesungen und Definitionen in einer gemeinsamen Spalte aus. Die Grundform-Aktion verwendet den neutralen Schaltflächenstil. Beim Ziehen zeigt eine vertikale Einfügemarke die Position vor oder nach der Zielplatzierung. Jisho-Importe speichern unterstützte Konjugationsfamilien als Vokabel-Tags; neu erstellte Verben öffnen vor dem Einfügen die Transformationsauswahl. Adverbien behalten ihre Wortart; das aktuelle japanische Schema definiert keine Adverb-Transformationen.

Wörterbuchanbieter können prerequisites als Liste von { key, layer, label } zurückgeben. Nach Auswahl eines Treffers im Editor löst Cognis vorhandene zusammengesetzte Schriftkarten im vorgesehenen Sichtbarkeitsbereich auf oder ruft fehlende Karten ab und erstellt sie samt Definitionen und Lesungsgraph. Atomare Zeichen und Partikeln können so nicht erstellt werden. Alias-Schlüssel werden in der Hauptkarte und versteckten Lesungen durch kanonische IDs ersetzt. Die Vokabeleingabe bleibt erhalten; importierte Schriftverweise gelten nur, solange die Eingabe der Suche entspricht. Das Anzeigen von Suchergebnissen erstellt keine abhängigen Karten.

Fehlende Pflichtfelder werden vor dem Speichern über registrierte ergänzende Anbieter vervollständigt; Kanji-Strichmuster stammen von KanjiVG. Jedes Kanji wird zusammen mit seinen Definitionen und versteckten Lesungen als ein validierter Graph im vorgesehenen Sichtbarkeitsbereich gespeichert.

## Schrift der Kanji-Aussprache

Die Kanji-Abfrage wandelt Jishos On-Lesungen in Katakana für Kartenaussprachen und Lesungsverknüpfungen in Hiragana um. 僕 enthält neben しもべ auch ぼく. Identische Kun- und On-Aussprachen werden nach der Umwandlung zusammengeführt; die ursprüngliche Schreibweise wie ボク bleibt in den verborgenen Wörterbuchmetadaten erhalten. Katakana-Schreibweisen von Vokabeln und die Filterung doppelter Suchlesungen behalten ihr bisheriges Verhalten.

Die primäre Lesung folgt häufigen exakten Worttreffern von Jisho: 僕 zeigt zuerst ぼく und danach しもべ. Verwandte Wörter und nicht belegte Kanji-Lesungen ändern die Reihenfolge nicht. Schlägt die Wortabfrage fehl, bleibt das Kanji-Ergebnis nutzbar und der Fehler wird sicher protokolliert.

## Auswahl gleicher Zusammensetzung

Cognis bündelt Wörterbuchtreffer gleicher Schreibzusammensetzung als alternative Lesungen und Bedeutungen. Eine andere Schreibweise wird beim Anklicken sofort übernommen und ihre benötigten Kanji werden aufgelöst oder erstellt. Weiter oder Schließen behält die genaue Zusammensetzung und verwirft erweiterte Treffer. Lesekarten behalten ihren Pfad zu einzelnen Kana. Auswahl, Kartenerstellung, Sichtbarkeitsprüfung, Zwischenspeicherung und Benachrichtigungen bleiben Aufgaben des Hosts.

Das Schema legt die Erkunden-Pfade `kana`, `kanji`, `vocabulary` und `sentences` unter `/study/ja/` fest. Aktuelle Modul- und Inhaltsmetadaten stehen in den Manifesten. Cognis verwaltet Importe, Grenzen, Stapelfreigaben und Navigation; das Modul liefert deklarative Ebenennamen und Wörterbuchdaten.

## Review und Lebenszyklus

Das Modul verlangt `study:library:provider` direkt und entfernt Suchregistrierungen, wenn Aufnahme, Fähigkeitsveröffentlichung oder Flow-Registrierung fehlschlagen. Lebenszyklusänderungen erhalten Inhaltsidentitäten.

Library stellt `deleteContentPack(root)` über die öffentliche Provider-Capability bereit. Provider-Datensätze, abhängige Karten, Paketbelege und Dateien werden in einer Transaktion des Lösch-Flows entfernt; fehlgeschlagene Audit-Hooks rollen alles zurück. Kaskaden verwenden die vorhandenen Study-Benachrichtigungen. Schemas bleiben für unabhängige eigene Inhalte erhalten. Die Deinstallation sperrt keine Inhalte, sodass eine Neuinstallation das Paket wiederherstellen kann.
