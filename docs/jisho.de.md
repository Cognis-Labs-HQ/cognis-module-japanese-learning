# Wörterbuchintegration

Modul- und Inhaltspaketversion 2.2.93 behalten Schemarevision 88 bei. Jisho registriert sich über `study:library:provider` mit `searchable: true` und der Fähigkeit `dictionary`. Unterstützt werden Kana, Kanji und Vokabeln; Sätze und die Erstellung anbietereigener Partikel bleiben ausgeschlossen.

## Maßgebliche Suche

Wort- und Kanji-Anfragen beziehen maßgebliche Jisho-Daten auch bei Treffern im Inhaltspaket. Lokale Inhalte dienen nur als Ersatz, wenn Netzwerkabrufe ausdrücklich nicht verfügbar sind; Kana werden lokal durch den Anbieter aufgelöst. Die Einzelzeichen-Kanji-Suche liefert Kun-/On-Lesungen, Bedeutungen, Strichzahl, Schulstufe, JLPT und Häufigkeit. Anfragen verwenden einen Cognis-User-Agent, ein Zeitlimit von 15 Sekunden und sichere Fehlerprotokolle. Übertragungsfehler werden nicht als leere Treffer ausgegeben.

## Import in den Editor

Ein Treffer füllt den geöffneten Editor; mehrere Treffer erscheinen zur Auswahl und Bestätigung in einer horizontalen Vorschau. Vokabelabfragen erhalten den eingegebenen Text und die Komposition. Lesungen und Definitionen werden sofort übernommen. Jede Bedeutung, auch durch Semikolon getrennte Angaben, wird eine eigene Definition. Fehlende UI-Sprachen ergänzt optional Cognis über die Lokalisierungsfähigkeit; das Modul erfindet keine Übersetzungen und kopiert kein Englisch in andere Sprachen. Quell-URLs und vollständige Originaldaten stehen ausschließlich in verborgenen `dictionary_data`-Metadaten.

## Lesungsgraphen

Kanji mit mehreren Lesungen erhalten je eine verborgene Vokabel mit Rückverweis auf das Kanji, geordneten Kana-Lesungslinks und direkten Definitionen. Kanji mit einer Lesung verweisen direkt auf Kana. Wortlesungen bevorzugen vorhandene Kanji-Lesungssegmente und ergänzende Kana. Cognis löst installierte Identitäten auf, verwendet passende Zwischenkarten bei erneutem Import wieder und prüft Felder, Sichtbarkeit und ACLs vor der atomaren Speicherung. Zeichen und Partikel bleiben anbietereigen. Redundante Katakana-Wiederholungen werden entfernt, sofern diese Schreibweise nicht ausdrücklich im Wörterbuch steht; echte On-Lesungen und Lehnwörter bleiben erhalten.

## Core besitzt den Cache

Cognis Core besitzt den Wörterbuchcache über `core:cache`. Abfragen werden nach einer Stunde kalt und bei weiterer Nutzung geprüft. Änderungen werden an Zwölf-Stunden-Grenzen veröffentlicht; unveränderte Inhalte bleiben erhalten. Gleichzeitige Anfragen teilen eine Prüfung, fehlgeschlagene Prüfungen erhalten gültige Cache-Daten und der persistente Cache überlebt Neustarts. Module planen keine Wörterbuchabfragen und speichern keine Wörterbuchantworten. Jisho bietet keinen leichten Änderungsfeed; Prüfungen benötigen normale Suchantworten. Es gibt keine manuelle Aktualisierung. Lokale Links verwenden aktuell zugängliche Bibliothekskarten.

## Cache für Strichdateien

KanjiVG-Strichmuster verwenden einen getrennten, begrenzten Modulcache: höchstens 512 Bezeichnungen, erfolgreiche Antworten für 24 Stunden und fehlende Dateien für fünf Minuten. Gleichzeitige Abrufe teilen Anfragen; Fehler werden verworfen. Dieser Dateicache steuert weder Wörterbuchsuche noch Navigation. Jisho und KanjiVG nutzen den deterministischen Datenlader `reuse/content.js`; der Strichanbieter nutzt `reuse/lookup-cache.js`.

## Grenzen des Satzimports

Jishos Wort-API liefert Formen, Lesungen, Bedeutungen und Wortarten, aber keine Übersetzung beliebiger Sätze, Tokenpositionen, Flexionszuordnung oder Partikelanbindung. Ein zuverlässiger Satzimport benötigt weiterhin eine morphologische Analyse, einen Übersetzungsanbieter und einen modulverwalteten Graphplaner, der Text, Satzzeichen und flektierte Lesungen erhält. Jisho kann lexikalische Knoten ergänzen, aber diese Pipeline nicht allein bereitstellen. Eine Satzimport-Fähigkeit wird nicht angeboten.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)

## Häufige Wörterbucheinträge

Bei gleich genauen Treffern stehen von Jisho mit is_common markierte Einträge vor seltenen Einträgen. Exakte Treffer bleiben vor verwandten Treffern. Jisho liefert keine Häufigkeit einzelner Bedeutungen: Definitionen behalten die ursprüngliche Reihenfolge, darunter room an erster Stelle für 室, statt vom Editor umgekehrt zu werden.

## Wörterbuchtransformationen

Transformationskarten richten Titel, Lesungen und Definitionen in einer gemeinsamen Spalte aus. Die Grundform-Aktion verwendet den neutralen Schaltflächenstil. Beim Ziehen zeigt eine vertikale Einfügemarke die Position vor oder nach der Zielplatzierung. Jisho-Importe speichern unterstützte Konjugationsfamilien als Vokabel-Tags; neu erstellte Verben öffnen vor dem Einfügen die Transformationsauswahl. Adverbien behalten ihre Wortart; das aktuelle japanische Schema definiert keine Adverb-Transformationen.

Wörterbuchanbieter können prerequisites als Liste von { key, layer, label } zurückgeben. Nach Auswahl eines Treffers im Editor löst Cognis vorhandene zusammengesetzte Schriftkarten im vorgesehenen Sichtbarkeitsbereich auf oder ruft fehlende Karten ab und erstellt sie samt Definitionen und Lesungsgraph. Atomare Zeichen und Partikeln können so nicht erstellt werden. Alias-Schlüssel werden in der Hauptkarte und versteckten Lesungen durch kanonische IDs ersetzt. Die Vokabeleingabe bleibt erhalten; importierte Schriftverweise gelten nur, solange die Eingabe der Suche entspricht. Das Anzeigen von Suchergebnissen erstellt keine abhängigen Karten.

Fehlende Pflichtfelder werden vor dem Speichern über registrierte ergänzende Anbieter vervollständigt; Kanji-Strichmuster stammen von KanjiVG. Jedes Kanji wird zusammen mit seinen Definitionen und versteckten Lesungen als ein validierter Graph im vorgesehenen Sichtbarkeitsbereich gespeichert.
