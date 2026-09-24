# Standard für das japanische Inhaltspaket

Das Cognis-Japanisch-Modul installiert deklarative japanische Lerndatensätze in die hosteigene Study-Bibliothek und bleibt dabei von Bibliotheksinternas, Datenbanken, APIs und Browsercode isoliert.

## Verwendung

Aktivieren Sie das Study-Gateway und den Bibliotheksadapter und anschließend dieses Modul. Sein Bootstrap löst `study:library` aus `ctx` auf und übernimmt `data/library`. Administratoren und Lernende verwenden die vom Bibliotheksadapter erzeugte Study-Oberfläche statt einer moduleigenen Route.

Da die Sprachbeschreibung keine ausführbaren Unterseiten deklariert, stellt Cognis Study das generierte Bibliotheksziel unter `/study/library?language=ja` bereit. Der validierte Sprachparameter bleibt an Bibliothekslinks, Detailnavigation, Direktaufrufen und im Browserverlauf erhalten; authentifizierte Lernende dürfen lesen, während die Bereichsregeln der Bibliothek das Erstellen und Veröffentlichen weiterhin schützen.

Das externe Modul deklariert das Study-Gateway als Komponentenabhängigkeit. Es erkennt den Bibliotheksadapter über die erforderliche Fähigkeit `study:library`, statt die Adapter-UUID als eigenständig installierbare Komponente zu behandeln.

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

Atomare und zusammengesetzte Schrifteinheiten stellen nun erforderliche Aussprachelisten und HTTPS-Audioverweise bereit, ohne binäre Medien mitzuliefern. Die eigene Partikelebene speichert Metadaten zur grammatischen Funktion, und Satzdatensätze können geordnete Wort- und Partikelverweise bewahren.

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

Eine festgelegte Kompositum-Aussprache muss über `pronunciation-readings` die größten deklarierten Lesungssegmente in Anzeigereihenfolge referenzieren. `日本語` verlinkt beispielsweise `にほん` mit dem ausgeblendeten Lesungseintrag für `日本` und `ご` mit dem ausgeblendeten Lesungseintrag für `語`. Das sichtbare Kompositum darf diese Segmente nicht zusätzlich direkt als atomare Kana referenzieren.

## Kontextbezogene Lesungsdefinitionen

Jeder paketierte Wortschatz-Lesungseintrag erhält eine lokalisierte Definition, wenn seine Verwendung enger ist als die Schrifteinheit, die auf ihn verweist. Die Wortschatzdefinition ist maßgeblich. Eine Definition darf nur fehlen, wenn die Bedeutung wirklich mit der Quelle übereinstimmt und der Eintrag über eine verwandte Eintragskarte erreicht wird; Titelkompositionslinks und Vor-/Zurück-Steuerungen löschen diesen Rückfallkontext absichtlich.

## Polysemie, Homophone und Dateneigentum

Mehrere Definitionsverweise werden nur verwendet, wenn ein einzelner lexikalischer Eintrag wirklich mehrere eng verwandte Bedeutungen hat. Homophone mit unterschiedlichen Bedeutungen erhalten getrennte Wortschatzeinträge, auch wenn ihre Kana-Bezeichnungen übereinstimmen. Alle japanischen Zeichen, Wörter, Partikeln, Sätze und lokalisierten Bedeutungen müssen als deklaratives JSON unter `data/library/content/` liegen; Laufzeitcode darf keine Sprachdaten einbetten.

## Vollständiger Pfad vom Satz bis zu Kana

Jede konventionelle lexikalische Form im Kern verwendet Kanji. Ein Satz verweist nur auf sichtbaren Wortschatz und Partikeln; sichtbarer Wortschatz setzt sich über Kanji und verborgenes Lesevokabular zusammen; jede verborgene Lesung wird aus atomaren Kana rekonstruiert. Tests müssen jeden Pfad ablehnen, der Wortschatz, Kanji, Lesevokabular oder Kana überspringt.

## Vom Host normalisierte Datensatzsteuerung

Vor der Veröffentlichung muss der installierte Library-Vertrag erfüllt sein: Definitionsdatensätze sind stets ausgeblendet und verwenden `class: "definition"`; geordnete lexikalische Sequenzen verwenden `class: "composite"`; Partikeln verwenden `class: "particle"` und `editable: false`. Tests müssen diese Werte exakt prüfen, damit Anbieter-Hashes und installierte Datensätze nach der Host-Normalisierung übereinstimmen.

## Zusammensetzung flektierter Lesungen

Verwenden Sie `word-spelling` für einen bedeutungstragenden mehrteiligen Kana-Lesungsabschnitt und `reading-kana` für jedes verbleibende einzelne Kana einer Flexionsendung mit lückenlosen Positionen. `reading-kana` ist eine Kompositionsbeziehung; verwenden Sie niemals ein unvollständiges `kana-spelling`, da diese Rolle eine vollständige alternative Schreibweise darstellt und die Endung sonst irreführend als eigenständige Aussprache rendert.

## Eindeutige „Verwendet von“-Eltern

Eine verborgene Lesung darf nicht mehrere eingehende Datensätze mit derselben Anzeigebezeichnung besitzen. Für ein sichtbares Wort aus einem einzelnen Kanji wird ein verborgener Wrapper für die vollständige Aussprache erstellt, der zum lexikalischen Wort gehört und sich aus dem Kanji-Lesungsdatensatz zusammensetzt. Die Kanji-Lesungskarte hat dann ein Kanji-Elternteil und ein anders bezeichnetes Lesungs-Elternteil; der Wrapper besitzt nur das sichtbare lexikalische Elternteil.

## Aussprachegraph für Sätze

Das Aussprachefeld eines Satzes verweist über `pronunciation-readings` auf genau einen verborgenen Wortschatzdatensatz mit vollständiger Lesung. Dieser Datensatz rekonstruiert die gesamte Aussprache lückenlos mit `word-spelling`-Verweisen auf die nächstliegenden verborgenen lexikalischen Lesungen und `reading-kana`-Verweisen auf atomare Partikel- oder nichtlexikalische Kana. Tests müssen bei fehlenden Teilzeichenfolgen, nicht verborgenen Wortschatzzielen, direkten Satz-zu-Zeichen-Abkürzungen oder unverknüpften Lesungen fehlschlagen.

## Zyklenfreie Navigation und lexikalische Lesungen

Verfasste Lernverknüpfungen bilden einen gerichteten azyklischen Graphen, und Kana-Zeichen beenden die Navigation. Kanji dürfen ihre Aussprache über verborgene Lesevokabeln in geordnete Kana auflösen; diese Lesungen verweisen jedoch niemals zurück auf das Kanji oder seine lexikalischen Nutzer. Eine Lesung mit eigener lexikalischer Bedeutung, etwa der Tageszähler `か`, ist sichtbares Vokabular mit einer semantischen Klasse und nicht `reading:kanji`.

## Direkte Kana-Zusammensetzung für Lesungstitel

Jeder ausgeblendete Aussprachedatensatz setzt seinen vollständigen Titel über die reine Kompositionsbeziehung `reading-kana` direkt aus geordneten atomaren Kana zusammen. Für Lesungsdatensätze hat diese Beziehung die Darstellungsrolle `composition`: Ein Lesungstitel darf nicht über `word-spelling` oder die Beziehung für alternative Schreibweisen geführt werden, da dies eine rekursive oder irreführende Kartennavigation erzeugt.

## Kanonischer Lesungsgraph

Es werden nur Datensätze paketiert, die am aktuellen deklarierten Graphen teilnehmen. Ersetzte ausgeblendete Lesungen werden entfernt, statt getrennte Kompatibilitätsdatensätze zu behalten. Sichtbares Kanji-Vokabular muss direkt auf geordnete atomare Kana verweisen; ein Kanji darf den passenden sichtbaren lexikalischen Datensatz referenzieren.

## Kanji-zu-Kana-Verwendungsabhängigkeiten

Jedes Kanji muss für jedes atomare Kana, das in seiner deklarierten Ausspracheliste vorkommt, genau eine deduplizierte `reading-kana-dependency`-Referenz hinzufügen. Diese Beziehung hat keine Darstellungs- oder Resolver-Rolle und dient ausschließlich dazu, die umgekehrte Verwendungsnavigation symmetrisch zu machen, nachdem Lernende einer lexikalischen Lesung zu atomaren Kana gefolgt sind. Die normale `readings`-Beziehung bleibt die Deep-Link-Quelle des Aussprachefelds.

## Vom Elterneintrag bestimmte zusammengesetzte Aussprachen

Nur der sichtbare Satz besitzt Beziehungen zwischen seinen lexikalischen Kindern und Partikeln. Jedes sichtbare Kanji-Wort verweist über `pronunciation-readings` auf genau eine ausgeblendete vollständige Kana-Aussprache, die sich über geordnete `reading-kana` rekonstruiert. Satzdatensätze dürfen keinen parallelen vollständigen Aussprachedatensatz referenzieren, und Aussprachekinder dürfen niemals Geschwisteraussprachen referenzieren, nur weil ihre Wörter im selben Satz vorkommen.

## Mit Vokabeln verknüpfte Satztiteldetails

Setze `input.linkRelationship` des Aussprachefelds eines Satzes auf `words`. Der Host muss die vollständige Aussprache jedes Wortes als Alias erkennen und dabei den sichtbaren Vokabeleintrag als Linkziel beibehalten. Füge weder Aussprachekinder auf Satzebene noch Verknüpfungen zwischen den Lesungen benachbarter Wörter hinzu; jeder Vokabeleintrag besitzt unabhängig seinen Lesepfad zu atomaren Kana.

## Vokabeleigene Aussprachegrenzen

Wenn eine Kanji-Lesung in einem vorhandenen sichtbaren Vokabeleintrag vorkommt, muss der Aussprachelink des Kanji auf diese Vokabel zielen. Nur die Vokabel darf den vollständigen Aussprache-Wrapper besitzen. Darin werden bedeutungstragende Kanji-Abschnitte über die nächstgelegene verborgene Lesung verknüpft und jedes verbleibende einzelne Kana-Suffix direkt mit `reading-kana`; für ein solches Suffix darf weder ein Ausspracheeintrag noch eine Verbindung zu einer benachbarten Lesung entstehen.

## Vollständige Links der Satzaussprache

Die Eingabe einer Satzaussprache muss jede Bestandteilsbeziehung deklarieren, die einen angezeigten Leseabschnitt liefern kann. Behalte `linkRelationship: "words"` zur Kompatibilität bei und deklariere `linkRelationships: ["words", "particles"]` für die vollständige Auflösung. Der Host muss diese geordneten Referenzen zusammenführen und den Aussprachealias jedes Ziels abgleichen, sodass Wörter Vokabeln und Partikeln Partikeleinträge öffnen.
