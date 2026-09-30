# Standard für das japanische Inhaltspaket

Das Cognis-Japanisch-Modul installiert deklarative japanische Lerndatensätze in die hosteigene Study-Bibliothek und bleibt dabei von Bibliotheksinternas, Datenbanken, APIs und Browsercode isoliert.

## Verwendung

Aktivieren Sie das Study-Gateway und den Bibliotheksadapter und anschließend dieses Modul. Sein Bootstrap löst `study:library:provider` aus `ctx` auf und übernimmt `data/library`. Administratoren und Lernende verwenden die vom Bibliotheksadapter erzeugte Study-Oberfläche statt einer moduleigenen Route.

Da die Sprachbeschreibung keine ausführbaren Unterseiten deklariert, stellt Cognis Study das generierte Bibliotheksziel unter `/study/library?language=ja` bereit. Der validierte Sprachparameter bleibt an Bibliothekslinks, Detailnavigation, Direktaufrufen und im Browserverlauf erhalten; authentifizierte Lernende dürfen lesen, während die Bereichsregeln der Bibliothek das Erstellen und Veröffentlichen weiterhin schützen.

Das externe Modul deklariert das Study-Gateway als Komponentenabhängigkeit. Es erkennt den Bibliotheksadapter über die erforderliche Fähigkeit `study:library:provider`, statt die Adapter-UUID als eigenständig installierbare Komponente zu behandeln.

## Technische Spezifikation

### Paketstruktur

`data/library/manifest.json` benennt Paket, unveränderliche Paketversion, Inhaltsrevision, Schema, Inhaltswurzel, Herausgeber und Lizenz. Jedes unmittelbare Inhaltsverzeichnis entspricht einer Ebene in `schema.json`; JSON-Dateien enthalten Arrays stabiler Datensätze.

### Schema und Graph

Schema und Manifest besitzen denselben Namensraum `ja`, und jede Datensatz-ID beginnt mit `ja:`. Das Schema definiert `characters`, `alt-characters`, `definitions`, `words`, `particles` und `sentences` mit lokalisierten Metadaten auf Deutsch, Englisch, Indonesisch und Japanisch. Semantische Rollen steuern neutrale generierte Oberflächen. Felder verwenden typisierte Werte und Hinweise für die Detaildarstellung; Ebenen veröffentlichen Aktivitätskompatibilität und Interessensbereiche. Gerichtete Beziehungen deklarieren lokalisierte Metadaten, Zielebenen, Kardinalität, Pflichtziele, Reihenfolge, verpflichtendes Löschverhalten und optionale Resolver-Rollen. Geordnete Referenzen tragen eindeutige nichtnegative Positionen, und jedes Ziel existiert im selben Paket.

Paketlokale Datensatz-IDs verwenden nur portable kleingeschriebene ASCII-Buchstaben, Ziffern, Trennzeichen und Doppelpunkte; japanische Schriftzeichen stehen in `label`, niemals in `id`. Dadurch bleibt die Übernahme mit dem Kennungsvertrag für Bibliotheksdatensätze kompatibel.

### Lebenszyklus und Eigentümerschaft

`bootstrap.js` bezieht ausschließlich öffentliche Fähigkeiten über `ctx`, lässt das Paket von der Bibliothek übernehmen, veröffentlicht die japanische Sprachbeschreibung und protokolliert den Beleg. Die Host-Bibliothek besitzt Validierung, Namensraum-IDs, Transaktionen, Idempotenz, Persistenz, Routen und generierte UI. Dieses Modul registriert keine API- oder Seitenrouten und greift auf keine Host-Datenbank zu.

### Aktualisierungen und Lizenzierung

Schemaänderungen erfordern eine höhere Schemaversion. Inhaltsänderungen erfordern eine neue Paketversion oder Inhaltsrevision. Alle gebündelten Datensätze verwenden die im Paketmanifest erklärte Lizenz und Attribution.

Die Wörterbuch-Ebene `definitions` deklariert moduleigene Definitionslokalisierung mit stabilen Zeichenkettenschlüsseln `japanese:definitions:*` und einem typisierten Feld `localizedText`. Jede vorinstallierte Definition enthält deutschen, englischen, indonesischen und japanischen Text, sodass Verbraucher Anzeigezeichenketten ohne Sprachdaten aus Cognis Core auflösen können.

## Aussprache-Audio und Partikeln

Atomare und zusammengesetzte Schrifteinheiten stellen erforderliche Aussprachelisten und ein optionales Audio-Uploadfeld bereit. Referenziertes Audio muss als authentifiziertes Paket-Asset mitgeliefert werden; externe Audio-URLs sind ungültig. Die eigene Partikelebene speichert Metadaten zur grammatischen Funktion, und Satzdatensätze können geordnete Wort- und Partikelverweise bewahren.

## Bibliotheksnative Bedeutungen

Die doppelten Felder `romanization`, `reading`, `readings`, `meaning`, `function` und die Definitionssprache wurden entfernt. Die Aussprache verwendet nun einheitlich das von der Bibliothek erkannte Feld `pronunciation`; Kanji, Wörter und Partikeln bilden Bedeutungen über Beziehungen zu lokalisierten Definitionsdatensätzen ab.

## Kana-gestützte Kanji-Lesungen

Jede Kanji-Lesung ist ein eigener Wortschatzdatensatz, dessen geordnete `kana-spelling`-Verweise die genauen Hiragana-Zeichen gruppieren. Kanji verweisen in Aussprache-Reihenfolge auf diese Lesungsdatensätze, sodass mehrteilige Kana-Lesungen voneinander getrennt bleiben. Katakana-Zeichen behalten eigene IDs und Verweise und bleiben für tatsächlich in Katakana geschriebene Inhalte verfügbar.

## Aktueller Aktivierungsvertrag der Bibliothek

Filterabzeichen für Schriftsystem und JLPT deklarieren nun benannte, gegenseitig ausschließende Filtergruppen, die von Library 2.6 unterstützt werden. Das Modul aktiviert `allowBootstrapFailure` bewusst nicht: Inhaltsimport und Veröffentlichung von `study:language:ja` sind seine wesentlichen Laufzeitaufgaben; ohne sie bliebe ein funktionsloses Modul aktiviert. Cognis PR #216 aktualisiert bei wiederholten Inhaltspaketimporten nun vorhandene Einträge, Ressourcen und Verweise und behebt damit den gemeldeten Fehler durch doppelte Verweise an der Persistenzgrenze.

## Verschachtelte Kana-Varianten

Kana-Varianten bleiben innerhalb ihres Schriftsystems und umfassen Dakuten, Handakuten, kleine Kana, übliche Yōon-Verbindungen und verbreitete Sokuon-Geminationen. Jede kontrahierte Form verweist direkt auf das Kana ihres Hauptlauts: `きゃ`, `きゅ` und `きょ` verweisen alle auf `き`; `じゃ`, `じゅ` und `じょ` verweisen alle auf `じ`. Das stimmhafte Elternzeichen verweist weiterhin auf seine stimmlose Form und bewahrt damit die sinnvolle Verschachtelung `し` → `じ` → `じゃ`.

## Aktueller Darstellungsvertrag der Bibliothek

Variantenbeziehungen besitzen weder eine Resolver-Rolle noch eine feste Richtung. Die Bibliothek weist dynamisch linke, obere oder rechte Positionen zu und klappt verschachtelte Kinder rekursiv auf; Kanji-Lesungen und Wortschreibweisen behalten Resolver-Rollen für navigierbare Bestandteile.

## Zusammensetzungen und Definitionen

Resolver-Rollen sind nun echten Zusammensetzungen vorbehalten: Kanji-Lesungen, Wortschreibweisen sowie geordneten Satzwörtern oder Partikeln. Beziehungen zur semantischen Definitionsebene deklarieren keinen Resolver mehr, sodass primäre und alternative Definitionsverweise als Bedeutungen statt als Zusammensetzungsgruppen erscheinen. Erforderliche Filter für Schriftsystem und Kenntnisstufe deklarieren außerdem gezielte Standard-Tags für den aktuellen Bibliotheksfiltervertrag.

## Vollständige Kana-Tabellen

Zusätzlich zu allen 46 grundlegenden Gojūon-Einträgen und 25 Dakuten- oder Handakuten-Formen je Schriftsystem enthält das Paket kleine Kana, alle üblichen Yōon-Reihen und verbreitete Sokuon-Geminationen. Beispiele sind `ひゃ`, `しゅ`, `じゃ` und `って` sowie ihre Katakana-Entsprechungen.

## Dynamische Variantenplatzierung

Jede Zeichen-Elternbeziehung deklariert nur `variant: true`; keine fordert `variantDirection` an. Dadurch kann die Bibliothek zur Laufzeit einen freien Platz auswählen und verschachtelte Ketten ohne vom Modul verursachte Platzkollisionen anzeigen.

## Standardmäßiges Kana-Raster

Die Zeichenebene fordert Zeilen mit fünf Karten an und begrenzt jedes Schriftsystem auf genau zehn Zeilen. Die letzte Zeile setzt `を`/`ヲ` in die Mitte und `ん`/`ン` ans Ende. Erweiterte Formen bleiben außerhalb des Rasters und werden über ihre Zeichen-Elternketten aufgeklappt.

## Definitionsgestützte Karten

An den neuesten Darstellungsvertrag der Bibliothek angepasst: Wörter, Partikeln und Sätze fordern nun lokalisierten, definitionsgestützten Kartentext an, und jeder solche Eintrag besitzt einen erforderlichen Definitionsverweis.

## Japanischspezifische Ebenenbezeichnungen

Die erzeugten Bibliotheksregister verwenden nun fachbezogene Modulbezeichnungen: Kana für atomare Zeichen, Kanji für zusammengesetzte Schrifteinheiten und Wortschatz für Wörter. Kanji-Lesungen verweisen auf gruppierte Wortschatzdatensätze statt auf eine abgeflachte Folge von Zeichenverweisen.

## Sichtbare Lücken in der Kana-Tabelle

Jedes Schriftsystem besitzt vier ausdrückliche `{ "blank": true }`-Zellen: zwei in der `y`-Zeile und zwei in der kombinierten `w`/`n`-Zeile. Hiragana hat dadurch keine nachlaufende Leerzeile, und Katakana beginnt ohne geerbte führende Leerstellen direkt an der nächsten Zeilengrenze.

## Kompakte Kana-Karten

Nur die Kana-Zeichenebene setzt `minimal: true`, sodass die Tabelle kompakte Karten mit der primären Kana-Bezeichnung darstellt. Kanji, Wortschatz und Sätze behalten ihre vollständige Darstellung von Aussprache, Definitionen, Metadaten und Zusammensetzung.

## Vollständig aufgelöste zusammengesetzte Einträge

Geordnete Zusammensetzungen entsprechen nun den neuesten Vorabprüfungen der Bibliothek. Jedes Satzzeichen wird von einem lückenlos geordneten Wort- oder Partikelverweis abgedeckt; `日本語が好き` enthält nun den zuvor fehlenden Wortschatzeintrag `好き`. Resolver-Beziehungen geben außerdem an, ob sie eine Zusammensetzung oder eine vollständige Aussprache darstellen.

## Ausgeblendete kleine Tsu-Formen

Jeder eigenständige oder zusammengesetzte Eintrag mit `っ` oder `ッ` setzt nun `hidden: true`. Die Datensätze bleiben mit ihren vorhandenen Elternverweisen zur Auflösung und Detailnutzung im Paket, können aber mit ihren Nachkommen nicht mehr am Ende der direkt durchsuchbaren Kana-Tabelle erscheinen.

## Filtergebundene Kana-Lücken

Die vier ausdrücklichen Tabellenlücken werden von den entsprechenden Hiragana- und Katakana-Rasterpositionen gemeinsam genutzt. Durch das abwechselnde Anordnen der jeweiligen Schriftzeichen kann der Bibliotheksfilter die inaktive Schrift entfernen, ohne deren Lücken am Anfang oder Ende der ausgewählten Tabelle stehen zu lassen.

## Vollständiger Kana-Löschgraph

Der Wortschatzeintrag `好き` deklariert jetzt seine geordnete Kana-Schreibweise aus `す` und `き`. Damit gehört er wie jeder andere Wortschatzeintrag zum Referenzabhängigkeitsgraphen und wird einbezogen, wenn Cognis eine kaskadierende Löschung der Kana-Tabellen anzeigt oder ausführt.

## Stabile Identitäten für Kana-Varianten

Das Paket wird für die neuesten Identitätsschutzmaßnahmen der Bibliothek neu veröffentlicht. Jeder Kana-Datensatz besitzt eine eigene Inhaltsidentität, und jeder Variantenverweis zielt auf einen anderen übergeordneten Datensatz. Dadurch kann eine erneute Aufnahme veraltete Kanten neu aufbauen, ohne ein Elternzeichen als sein eigenes Kind darzustellen.

## Explizite Kana-Kindhierarchien

Die Kana-Elternbeziehungen entsprechen jetzt dem neuesten Bibliotheksvertrag und sind sowohl als Varianten als auch als räumliche Kinder markiert. Da der doppelte Beziehungsabschnitt unterdrückt wird, ist das ausdrückliche Feld `usage_note` nicht mehr nötig und wurde zusammen mit seinen vier Datensatzwerten entfernt.

## Kanonischer Wortschatz für Kanji-Lesungen

Der doppelte lexikalische Datensatz `人` wurde entfernt. Der Kanji-Eintrag verweist jetzt nur auf seine unterschiedlichen Wortschatzlesungen `じん`, `にん` und `ひと`; jede Lesung setzt sich aus passenden Hiragana-Datensätzen zusammen und besitzt einen eigenen direkten Definitionsverweis.

## Modulbesitzvertrag aus PR 220

Das Modul fordert jetzt ausdrücklich vertrauenswürdige Privilegien an, weil es die standardisierte Fähigkeit `study:language:ja` außerhalb seines moduleigenen Namensraums veröffentlicht. Die Repository-Herkunft von Cognis Labs ermöglicht dem Host die Prüfung dieser Anfrage; der Bibliothekszugriff bleibt fähigkeitsbasiert und alle Registrierungen bleiben an den Lebenszyklus gebunden.

## Nächstgelegene deklarierte Bibliotheksbeziehungen

Kompositionen verwenden jetzt die nächstgelegenen Datensätze: `日本語` verweist auf das Wort `日本` und das Kanji `語`, während `日本` auf die Kanji `日` und `本` verweist. Geordnete Kana-Alternativschreibweisen stellen direkte Aussprache-Links bereit, und jedes Feld deklariert sein anbietereigenes Editor-Steuerelement und lokalisierte Optionen.

## Ausgeblendeter Lesungswortschatz für Kanji

Ein Kanji-Aussprachefeld muss für jede vollständige Lesung auf genau einen eigenen Wortschatzeintrag verweisen. Jeder reine Lesungseintrag muss `hidden: true` sein und sich über `kana-spelling` aus atomaren Kana zusammensetzen; gewöhnliche Wortschatzeinträge müssen sichtbar bleiben.

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Kontextbezogene Lesungsdefinitionen

Jeder paketierte Wortschatz-Lesungseintrag erhält eine lokalisierte Definition, wenn seine Verwendung enger ist als die Schrifteinheit, die auf ihn verweist. Die Wortschatzdefinition ist maßgeblich. Eine Definition darf nur fehlen, wenn die Bedeutung wirklich mit der Quelle übereinstimmt und der Eintrag über eine verwandte Eintragskarte erreicht wird; Titelkompositionslinks und Vor-/Zurück-Steuerungen löschen diesen Rückfallkontext absichtlich.

## Polysemie, Homophone und Dateneigentum

Mehrere Definitionsverweise werden nur verwendet, wenn ein einzelner lexikalischer Eintrag wirklich mehrere eng verwandte Bedeutungen hat. Homophone mit unterschiedlichen Bedeutungen erhalten getrennte Wortschatzeinträge, auch wenn ihre Kana-Bezeichnungen übereinstimmen. Alle japanischen Zeichen, Wörter, Partikeln, Sätze und lokalisierten Bedeutungen müssen als deklaratives JSON unter `data/library/content/` liegen; Laufzeitcode darf keine Sprachdaten einbetten.

## Vollständiger Pfad vom Satz bis zu Kana

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Vom Host normalisierte Datensatzsteuerung

Vor der Veröffentlichung muss der installierte Library-Vertrag erfüllt sein: Definitionsdatensätze sind stets ausgeblendet und verwenden `class: "definition"`; geordnete lexikalische Sequenzen verwenden `class: "composite"`; Partikeln verwenden `class: "particle"` und `editable: false`. Tests müssen diese Werte exakt prüfen, damit Anbieter-Hashes und installierte Datensätze nach der Host-Normalisierung übereinstimmen.

## Zusammensetzung flektierter Lesungen

Verwenden Sie `word-spelling` für einen bedeutungstragenden mehrteiligen Kana-Lesungsabschnitt und `reading-kana` für jedes verbleibende einzelne Kana einer Flexionsendung mit lückenlosen Positionen. `reading-kana` ist eine Kompositionsbeziehung; verwenden Sie niemals ein unvollständiges `kana-spelling`, da diese Rolle eine vollständige alternative Schreibweise darstellt und die Endung sonst irreführend als eigenständige Aussprache rendert.

## Eindeutige „Verwendet von“-Eltern

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Aussprachegraph für Sätze

Das Aussprachefeld eines Satzes verweist über `words` und `particles` auf jede geordnete sichtbare Bestandteilskarte. Der Host gleicht die vollständige Aussprache jedes Bestandteils als Alias ab, sodass jedes Lesungssegment seine Wortschatz- oder Partikelkarte öffnet statt einer einzelnen verborgenen Karte für den gesamten Satz. Vollständige Satzlesungs-Wortschatzeinträge und `pronunciation-readings`-Gruppen auf Sätzen sind verboten.

## Zyklenfreie Navigation und lexikalische Lesungen

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Direkte Kana-Zusammensetzung für Lesungstitel

Jeder ausgeblendete Aussprachedatensatz setzt seinen vollständigen Titel über die reine Kompositionsbeziehung `reading-kana` direkt aus geordneten atomaren Kana zusammen. Für Lesungsdatensätze hat diese Beziehung die Darstellungsrolle `composition`: Ein Lesungstitel darf nicht über `word-spelling` oder die Beziehung für alternative Schreibweisen geführt werden, da dies eine rekursive oder irreführende Kartennavigation erzeugt.

## Kanonischer Lesungsgraph

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Kanji-zu-Kana-Verwendungsabhängigkeiten

Kanji dürfen atomare Kana niemals direkt referenzieren. Ein Kanji erreicht Kana ausschließlich über seinen vollständigen Lesungsdatensatz, sodass die umgekehrte Verwendungsnavigation zuerst die unmittelbare Lesung zeigt (`あ` → `あめ` → `雨`), statt fälschlich jedes Kanji mit diesem Kana aufzulisten.

## Vom Elterneintrag bestimmte zusammengesetzte Aussprachen

Nur der sichtbare Satz besitzt Beziehungen zwischen seinen lexikalischen Kindern und Partikeln. Jedes sichtbare Kanji-Wort verweist über `pronunciation-readings` auf genau eine ausgeblendete vollständige Kana-Aussprache, die sich über geordnete `reading-kana` rekonstruiert. Satzdatensätze dürfen keinen parallelen vollständigen Aussprachedatensatz referenzieren, und Aussprachekinder dürfen niemals Geschwisteraussprachen referenzieren, nur weil ihre Wörter im selben Satz vorkommen.

## Mit Vokabeln verknüpfte Satztiteldetails

Setze `input.linkRelationships` des Aussprachefelds eines Satzes auf `["words", "particles"]`. Der Host muss die vollständige Aussprache jedes Wortes als Alias erkennen und dabei den sichtbaren Vokabeleintrag als Linkziel beibehalten. Füge weder Aussprachekinder auf Satzebene noch Verknüpfungen zwischen den Lesungen benachbarter Wörter hinzu; jeder Vokabeleintrag besitzt unabhängig seinen Lesepfad zu atomaren Kana.

## Vokabeleigene Aussprachegrenzen

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Vollständige Links der Satzaussprache

Die Eingabe einer Satzaussprache muss jede Bestandteilsbeziehung deklarieren, die einen angezeigten Leseabschnitt liefern kann. Deklariere `linkRelationships: ["words", "particles"]` für die vollständige Auflösung; der aktuelle Host liest den Array-Vertrag beim Erstellen der Titeldetail-Links. Der Host muss diese geordneten Referenzen zusammenführen und den Aussprachealias jedes Ziels abgleichen, sodass Wörter Vokabeln und Partikeln Partikeleinträge öffnen.

## Strichmuster-Metadaten

Jede vom Anbieter erstellte Schreibzeichenkarte muss ein unveränderliches erforderliches `strokePattern` enthalten. Verwende `coordinateSystem: "normalized"`; halte alle Punktkoordinaten im Bereich 0–1, die Punktzeiten innerhalb jedes geordneten Strichs monoton, optionalen Druck im Bereich 0–1 und die Toleranz im Bereich 0–100. Bewahre die Namensnennung externer Strichquellen in den Metadaten des Inhaltsmanifests auf. Erzeuge paketierte Muster aus den nach Unicode benannten KanjiVG-Pfaden mit genügend kubischen und quadratischen Unterteilungen, um jede Wendung und Schleife zu erhalten; spärliche Näherungen nur über Endpunkte sind ungültig.

## Laufzeit-Suche nach Strichmustern

Registriere über `study:library:provider` genau einen entfernbaren Library-Lookup-Anbieter. Unterstütze nur Schreibzeichenebenen des japanischen Schemas mit einem deklarierten `strokePattern`-Feld. Löse normalisierte, exakt übereinstimmende Bezeichnungen zuerst aus dem paketierten Inhalt auf. Lade für andere gültige japanische Kana oder Kanji das nach Unicode benannte SVG aus der kanonischen KanjiVG-Quelle, begrenze die Antwort, taste die geordneten Pfade als normalisierte Punkte mit Zeitwerten ab, speichere das Ergebnis zwischen und gib es unter `fields.stroke_pattern` mit exakter Herkunft und Konfidenz `1` zurück. Liefere für fehlende Zeichen oder nichtjapanische Eingaben keinen Vorschlag und leite die Strichreihenfolge niemals per OCR ab.

## Jisho-Anreicherung im Composer

Jisho darf nur über den generischen Vertrag `study:library:provider.registerLookupProvider` registriert werden und muss seine Entfernen-Funktion für die Lebenszyklusbereinigung zurückgeben. Die Kartensuche muss den nativen Datenbestand bevorzugen. Exakte mitgelieferte Kana-, Kanji- und Vokabeleinträge liefern ihre geprüften Felder und Beziehungen ohne Netzwerkzugriff. Jisho wird erst nach einem nativen Fehltreffer abgefragt; ein begrenzter Promise-Cache fasst gleichzeitige Anfragen zusammen und verwendet erfolgreiche Antworten erneut. Externe Vorschläge dürfen nur schema-konforme Felder und Verweise auf vorhandene Anbietereinträge liefern; nicht verfügbare Definitionen oder Links bleiben leer, statt erfunden zu werden.

Laufzeit-Provider-Einstiegspunkte dürfen keine nicht bereitgestellten npm-Pakete importieren; der KanjiVG-SVG-Pfad-Sampler gehört zum Modul und ist im Manifest enthalten.

Der Laufzeit-Bootstrap muss den inversen Library-Anbieter mit `ctx.capabilities.require` auflösen und Lookup-Anbieter anschließend über die zurückgegebene Fähigkeit registrieren. Für diesen erforderlichen Anbieter darf `ctx.getCapability` nicht verwendet werden.

Zuerst ist die injizierte öffentliche Fähigkeit `study:library:provider` aufzulösen. Stellt der Host diese öffentliche Fähigkeit nur für die Aktivierungsprüfung, aber nicht im Modul-ctx bereit, darf der injizierte Dienst `study:library` ausschließlich als Träger derselben Schnittstelle aus `registerLookupProvider` und `ingestContentPack` verwendet werden. Es darf kein zweites Anbieterprotokoll entstehen.

## Auflösbare Titeldetails

Für jeden Satz und jedes Kanji mit Aussprache muss der Alias-Kompositionsalgorithmus des Hosts in Tests nachgebildet werden. Alle verknüpften Ziele müssen in Beziehungsreihenfolge exakt die angezeigte Aussprache ergeben. Ein Kanji-Titel veröffentlicht eine primäre eigene reine Kana-Lesung; weitere Lesungen liegen außerhalb des Aussprachefelds und seines `input.linkRelationships`-Pfads, damit sie nicht sämtliche Titellinks als eine zusammengefügte Kette scheitern lassen.

## Aktueller rekursiver Aussprachevertrag

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Vollständige Aussprachepfade

Jeder mit Kanji geschriebene Wortschatzeintrag verknüpft seine Schreibweise mit den enthaltenen Kanji und führt seine Aussprache über einen ausgeblendeten Datensatz für die vollständige Aussprache. Diese Datensätze bewahren die genauesten verfügbaren Kanji-Lesesegmente und verwenden atomare Kana nur für Flexionsendungen oder Abschnitte ohne vorhandene Kanji-Lesung. Satzaussprachen führen entsprechend über einen vollständigen ausgeblendeten Datensatz aus Wortaussprachen und Partikel-Kana. Jisho-Vorschläge prüfen die Schrift je Ebene, erzeugen keine unvollständigen Kana-Gruppen und ergänzen verfügbare Kanji-Schreibverknüpfungen.

### Gemeinsame Aussprachekarten für Homophone

Wenn mehrere unterschiedliche Kanji-Wortschatzeinträge exakt dieselbe vollständige Kana-Aussprache haben, können sie eine ausgeblendete strukturelle Aussprachekarte gemeinsam verwenden. Die gemeinsame Karte rekonstruiert die Lesung direkt aus atomaren Kana und enthält keine Definitionen. Jede sichtbare Vokabel behält nur dann eine Definition, wenn sie von ihrem Kanji-Elterneintrag abweicht; andernfalls wird die Definition über die Schreibbeziehung übernommen.

## Stabile Navigation zwischen Ebenen

Beziehungen und niemals eine Suche nach gleicher Beschriftung bestimmen die Kartennavigation. Eine Vokabellesung darf nur dann auf einen weiteren Vokabeleintrag verweisen, wenn dieses Ziel einen echt kleineren Leseabschnitt darstellt; gleich beschriftete Verknüpfungen zwischen Vokabeleinträgen sind verboten. Vollständige Aussprachehüllen für einzelne Kanji rekonstruieren sich deshalb direkt aus geordneten atomaren Kana, während Zusammensetzungen Verknüpfungen zu kleineren erfassten Kanji-Lesesegmenten und Flexions-Kana behalten. Ausgeblendete Lese- und Aussprachedatensätze sind strukturell und enthalten keine Definitionen. Sichtbare Vokabeln behalten nur dann eine Definition, wenn ihre lexikalische Bedeutung vom referenzierten Kanji abweicht; andernfalls liefert die Schreibbeziehung die Definition des übergeordneten Eintrags. Der Host blendet eine einzige Definition aus, deren normalisierter Text exakt der Hauptbeschriftung einer Vokabelkarte entspricht.

## Abdeckung der Kanji-Aussprache

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Geprüfter Stapel zu Ort und Art und Weise

Der geprüfte Anfängerstapel ergänzt `ここ`, `そこ`, `どこ`, `いる`, `ある`, `きれい`, `とても`, `ゆっくり` und `です` sowie acht abwechslungsreiche Sätze über Orte, Existenz, Fragen, Aussehen und Art und Weise. Jedes neue Wort besitzt eine lokalisierte Definition und geordnete Kana-Schreibweise; jeder Satz besitzt eine exakte lokalisierte Bedeutung, geordnete lexikalische Zusammensetzung und einen vollständigen ausgeblendeten Aussprachepfad.

## Destruktive Deinstallationsbereinigung

Beim Deaktivieren des Moduls und bei einer gewöhnlichen Deinstallation bleiben alle importierten Japanisch-Datensätze erhalten. Nur die ausdrückliche Option `deleteContent: true` des Host-Deinstallations-Hooks darf die Operation `deleteContentPack` des Study-Library-Providers aufrufen; dieser Provider ist für die transaktionale Kaskadierung der Beziehungen zuständig und muss einen Fehler melden, bevor Cognis das Modul entfernt. Die administrative Kompatibilitätsroute `DELETE /api/v1/modules/study-language-ja/config` löscht ausschließlich modullokale Konfiguration (dieses Modul besitzt keine) und antwortet deshalb mit `204`, ohne Lerninhalte zu verändern.

## Definitionen auf Wortschatzkarten

Der Karten-Renderer der Cognis Library liest Definitionen ausschließlich aus den direkten Definitionsbeziehungen eines Eintrags; eine Definition wird nicht über eine Kanji-Schreibbeziehung vererbt. Deshalb verweist jeder sichtbare, mit Kanji geschriebene Wortschatzeintrag direkt auf eine Definition, selbst wenn seine Bedeutung mit der seines Kanji-Schreibdatensatzes identisch ist. Ausgeblendete strukturelle Aussprachedatensätze bleiben definitionsfrei.

## Validierung von Jisho-Suchanfragen

Die Wortschatzsuche akzeptiert begrenzte japanische oder lateinische Suchbegriffe einschließlich mehrteiliger englischer Bedeutungen und verwendet Jishos höchstbewertetes Ergebnis, wenn keine japanische Schreibweise exakt mit der Anfrage übereinstimmt. Kana- und Kanji-Ebenen bleiben auf ein gültiges Zeichen beschränkt, da ihre Vorschläge die ausgewählte Schreibeinheitsebene beibehalten müssen. Ungültige Satzzeichen, Steuereingaben und überlange Anfragen werden vor dem Netzwerkzugriff abgelehnt.

## Grundformen von Verben, Adverbien und Transformationen

Die Wortschatzebene trennt markierte Grundformen von Verben und Adverbien in anbieterseitig benannte Transformationsansichten. Jedes Verb trägt das Tag `verb` und genau ein Konjugationsfamilien-Tag; das Schema unterscheidet Ichidan, reguläre Godan-Endungen, die Sondermuster `行く` und `ある` sowie das unregelmäßige `来る`. Deterministische Regeln leiten Höflichkeits-, Verneinungs-, Vergangenheits- und Te-Formen zur Anzeigezeit ab. Japanische Adverbien tragen nur `adverb` und bleiben unverändert, sodass ihre Transformationsansicht die kanonische Grundkarte ohne erfundene Flexionen zeigt. Das Inhaltspaket speichert niemals erzeugte Verbformen oder abgeleitete Adverbkarten.

## Vollständige Darstellung japanischer Aussprache

Atomare Kana behalten die Hepburn-Umschrift für ihre eigenen Karten, bei der rekursiven Ausspracheableitung muss jedoch die jeweilige Kana-Beschriftung verwendet werden. Jede Aussprache von Kanji, Wortschatz, Partikeln und Sätzen bleibt vom Anfang bis zum Ende japanischer Text. Segmentierte Satzlesungen müssen den vollständig zusammengesetzten Wert erhalten und sichtbar darstellen; das Titellayout darf ihn umbrechen oder verkleinern, aber niemals den letzten Bestandteil abschneiden.

## Lesungstitel aus atomaren Kana

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Mehrteilige Kana-Titel und Kleinform-Geometrie

Jeder mehrteilige Kana-Datensatz deklariert eine ausdrückliche `character-title`-Zusammensetzung zu seinen atomaren Kana. Dadurch kann die generische Label-Suche nicht zu einer gleich beschrifteten ausgeblendeten Wortschatzlesung verlinken. Zusammengesetzte Strichmuster weisen kleinen Kana wie `ゃ`, `ゅ`, `ょ` und `っ` einen schmaleren horizontalen Bereich zu; vollgroße Bestandteile behalten den größeren Bereich, sodass Yōon- und Geminationsübungen ihre konventionellen Größenverhältnisse bewahren.

## Satzverknüpfungen ohne vorgetäuschte Satzvokabeln

Die Satzaussprache verknüpft über `linkRelationships: ["words", "particles"]` jeden geordneten Leseabschnitt mit seinem vorhandenen sichtbaren Vokabel- oder Partikelbestandteil. Vollständige Satzaussprachen dürfen niemals als Vokabeldatensätze gespeichert werden; Vokabeln dürfen außerdem keine Satz-, Komposit- oder Partikelstrukturen enthalten.

## Direkte Kanji-Lesungen zu Kana

Kanji-Aussprachegruppen verweisen direkt auf geordnete atomare Kana. Das Paket enthält keine ausgeblendeten `reading:kanji`-Vokabelkarten; eine Lesung wie `む` öffnet daher die Kana-Schreibeinheit statt einer gleich beschrifteten Vokabelkarte. Ausgeblendete `reading:pronunciation`-Datensätze sind vollständigen lexikalischen Wortlesungen vorbehalten und dürfen keine Kana-Beschriftung duplizieren.

## Tief verzweigte Transformationen

Verbtransformationssätze bilden nun tief verzweigte Pfade aus jeder kanonischen Grundkarte. Die Zweige umfassen höfliche Negativ- und Vergangenheitsformen, verneinte Vergangenheit und Verbindungsformen, Kausativ, Passiv, Potential, Volitional sowie mehrstufige Kausativ-Wunschketten. Jede Regel transformiert Schriftform und Aussprache unabhängig; lokalisierte Definitionsüberschreibungen erklären semantische Zweige. Adverbien bleiben unveränderliche kanonische Grundkarten, und keine erzeugte Form wird als Vokabeleintrag gespeichert.
