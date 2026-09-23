# Cognis Japanisch

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanisch ist ein deklaratives japanisches Inhaltspaket für die Cognis-Study-Bibliothek. Es liefert ein versioniertes Schema sowie validierte Zeichen-, Definitions-, Wort-, Partikel- und Satzdatensätze, ohne API-Routen, Persistenz oder Browseroberflächen zu besitzen.

## Voraussetzungen

- Cognis mit aktiviertem Study-Gateway und Bibliotheksadapter.
- Die Host-Fähigkeit `study:library`.

Das externe Modul deklariert das Study-Gateway als Komponentenabhängigkeit. Es erkennt den Bibliotheksadapter über die erforderliche Fähigkeit `study:library`, statt die Adapter-UUID als eigenständig installierbare Komponente zu behandeln.

## Entwicklung

```sh
npm install
npm test
npm run check:manifest
```

Beim Bootstrap bezieht das Modul `study:library` über `ctx` und ruft `ingestContentPack` für `data/library` auf. Cognis übernimmt Pfadsicherheit, Graphvalidierung, stabile interne IDs, Transaktionen, Idempotenz, Persistenz, API-Routen und schemagenerierte Study-Oberflächen.

Da die Sprachbeschreibung keine ausführbaren Unterseiten deklariert, stellt Cognis Study das generierte Bibliotheksziel unter `/study/library?language=ja` bereit. Der validierte Sprachparameter bleibt an Bibliothekslinks, Detailnavigation, Direktaufrufen und im Browserverlauf erhalten; authentifizierte Lernende dürfen lesen, während die Bereichsregeln der Bibliothek das Erstellen und Veröffentlichen weiterhin schützen.

Das Inhaltspaketmanifest erfasst Herausgeber, unveränderliche Paketversion, Inhaltsrevision, Schema- und Inhaltspfade sowie die Lizenz. `schema.json` deklariert japanische Ebenen, typisierte Felder, Beziehungen, Kardinalität, Reihenfolge und Resolver. Inhaltsdateien verwenden stabile paketlokale IDs und ausdrückliche Referenzen.

Paketlokale Datensatz-IDs verwenden nur portable kleingeschriebene ASCII-Buchstaben, Ziffern, Trennzeichen und Doppelpunkte; japanische Schriftzeichen stehen in `label`, niemals in `id`. Dadurch bleibt die Übernahme mit dem Kennungsvertrag für Bibliotheksdatensätze kompatibel.

Schema und Paket teilen den Namensraum `ja`, und jede Datensatz-ID beginnt mit `ja:`. Metadaten für Schema, Ebenen, Felder und Beziehungen enthalten lokalisierte Bezeichnungen auf Deutsch, Englisch, Indonesisch und Japanisch. Semantische Rollen, typisierte Werte, Detailhinweise, Aktivitätskompatibilität, Interessensbereiche, Pflichtziele, geordnete Positionen, Löschverhalten und Resolver-Rollen ermöglichen Cognis neutrale Oberflächen und die Durchsetzung des vollständigen Vertrags.

Das externe Modulmanifest veröffentlicht `/static/modules/study-language-ja/languages`, damit Cognis Marketplace-Metadaten vor dem Modul-Bootstrap übersetzen kann.

Die veröffentlichte Sprachbeschreibung stellt sowohl den kanonischen `code`-Wert `ja` als auch den kompatiblen `languageCode`-Wert bereit. Cognis PR #215 verwendet diesen Code, um die aktive Sprachschaltfläche zu kennzeichnen und die ausgewählte Sprache beim Öffnen eines Ziels der Study-Unternavigation im Routerverlauf zu erhalten.

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

Die angezeigten Lesungen einer Kanji-Karte verlinken auf eigene Wortschatzeinträge, die wiederum auf die Hiragana-Zeichen verweisen, aus denen die jeweilige Lesung besteht. Reine Lesungseinträge bleiben für Definitionen direkt verlinkbar, werden aber im Wortschatz-Browser ausgeblendet; gewöhnlicher Wortschatz bleibt sichtbar.

Festgelegte Komposita-Aussprachen verwenden die größten verfügbaren ausgeblendeten Lesungssegmente, statt jedes Kana direkt zu verlinken. `日本語` löst das angezeigte `にほんご` beispielsweise über die ausgeblendete Lesung `にほん` für `日本` und `ご` für `語` auf; erst diese Lesungseinträge verweisen auf einzelne Kana.

## Kontextbezogene Lesungsdefinitionen

Ausgeblendete Wortschatz-Lesungseinträge erhalten eine eigene Definition in allen vier Sprachen, wenn eine Lesung grammatisch oder lexikalisch enger als ihr Ursprungs-Kanji verwendet wird, etwa `にん` als Personenzähler oder `じん` als Nationalitätssuffix. Cognis darf die lokalisierte Definition einer Ausgangskarte nur übernehmen, wenn ein Link zu einem verwandten Eintrag Wortschatz ohne eigene Definition öffnet; deklarierte Definitionen haben immer Vorrang, und Titelkompositions- sowie Vor-/Zurück-Navigation übertragen keinen Rückfallkontext.

## Erweiterter Kerndatensatz

Das Paket enthält nun mehr als dreißig zusätzliche alltägliche Wortschatzeinträge, zehn weitere Partikeln und acht vollständig zusammengesetzte Beispielsätze, ausschließlich als deklaratives JSON unter `data/library/content/`. Echte Polysemie darf mehrere lokalisierte Definitionsverweise in einem Eintrag verwenden (`なおす`: reparieren/korrigieren), während Homophone wie `はし` (Brücke/Essstäbchen), `あめ` (Regen/Bonbon), `かみ` (Papier/Haar/Gottheit) und `はな` (Blume/Nase) getrennte Wortschatzeinträge mit eigenen Definitionen bleiben.

## Umfassende Partikelübungen

Der Partikelbestand umfasst nun mehr als sechzig einfache, zusammengesetzte, verbindende, einschränkende, aufzählende und satzabschließende Formen. Jede Partikel bleibt auch bei seltener Verwendung verfügbar und wird von mindestens einem geordneten Beispielsatz referenziert, damit ihre Beziehungen im Kontext erkundet werden können.

## Navigation durch Partikelbeispiele

Partikelbeispiele verwenden nun verfassten Kanji-Wortschatz wie `学校`. Jeder Satz öffnet dadurch einen vollständigen Pfad Satz → Wortschatz → Kanji → ausgeblendeter Lesewortschatz → atomares Kana, statt bei reinem Kana-Wortschatz zu enden.

## Bedeutungsvolle Partikelsätze

Definitionen von Partikelsätzen enthalten nun direkte lokalisierte Bedeutungen statt redaktioneller Bezeichnungen wie „Partikelbeispiel“. Die zugehörigen Lerninhalte verwenden knappe japanische Sätze und Wendungen, deren verknüpfter Wortschatz und Partikeln den angezeigten Inhalt rekonstruieren.

## Geprüfter Inhaltsgraph des Anbieters

Anbieterinhalte sind nun vor benutzereigenen Verschiebungen und Löschungen geschützt. Der Tierwortschatz verwendet die üblichen Schreibweisen `猫` und `犬`, verknüpft diese über ihre Kanji-Datensätze mit vollständigen ausgeblendeten Lesungen `ねこ` und `いぬ` und rekonstruiert diese Lesungen aus atomaren Kana. Satzbezeichnungen und Aussprachen stammen aus demselben geordneten Wortschatz- und Partikelgraphen.

## Paketvertrag aus Cognis PR 226

Das Paket veröffentlicht nun validierte JSON-kompatible Katalogmetadaten und ausdrücklich filterbare Felder für Schriftsystem und JLPT gemäß dem Vertrag für externe Pakete aus Cognis PR #226. Es verwendet weiterhin integrierte Feldtypen und geschützten Anbieterbesitz; Schema-Revision `40` bleibt unabhängig von Modulversion `2.2.5`.

## Abwechslungsreiche Kanji-basierte Lerninhalte

Sichtbarer Wortschatz verwendet nun die übliche japanische Schreibweise wie `私`, `水`, `電車`, `先生`, `食べる` und `行く`, während vollständige ausgeblendete Lesungen den Kana-Pfad erhalten. Die Partikelsammlung besteht nun aus 51 unterschiedlichen natürlichen Konstruktionen zu Menschen, Tieren, Wetter, Essen, Reisen, Lesen, Musik, Zeit und Arbeit, statt Partikeln wiederholt um `学校` auszutauschen.

## Klassifizierte, segmentweise verknüpfte Lesungen

Jeder Provider-Eintrag trägt nun eine namensraumgebundene semantische Klasse gemäß dem aktuellen Cognis-Library-Vertrag. Vollständige Aussprachen bewahren ihre innere Struktur: Von Kanji abgeleitete Abschnitte verweisen auf verborgenes Kanji-Lesevokabular, flektierende Kana auf atomare Kana. Dadurch wird `強い` über `つよ` und `い` aufgelöst, statt `つよい` unverknüpft anzuzeigen.

## Schutzregeln für Ebenenverknüpfungen

Die Pakettests leiten Verknüpfungserwartungen nun aus der semantischen Rolle jeder Schemaebene ab, lehnen verwaiste Anbieter-Datensätze ab und Mutationstests prüfen jede verknüpfte Ebene, damit getrennte Lerninhalte nicht unbemerkt validiert werden.
