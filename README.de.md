# Cognis Japanisch

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanisch ist ein deklaratives japanisches Inhaltspaket für die Cognis-Study-Bibliothek. Es liefert ein versioniertes Schema sowie validierte Zeichen-, Definitions-, Wort-, Partikel- und Satzdatensätze, ohne API-Routen, Persistenz oder Browseroberflächen zu besitzen.

## Voraussetzungen

- Cognis mit aktiviertem Study-Gateway und Bibliotheksadapter.
- Die Host-Fähigkeit `study:library:provider`.

Das externe Modul deklariert das Study-Gateway als Komponentenabhängigkeit. Es erkennt den Bibliotheksadapter über die erforderliche Fähigkeit `study:library:provider`, statt die Adapter-UUID als eigenständig installierbare Komponente zu behandeln.

## Entwicklung

```sh
npm install
npm test
npm run check:manifest
```

Beim Bootstrap bezieht das Modul `study:library:provider` über `ctx` und ruft `ingestContentPack` für `data/library` auf. Cognis übernimmt Pfadsicherheit, Graphvalidierung, stabile interne IDs, Transaktionen, Idempotenz, Persistenz, API-Routen und schemagenerierte Study-Oberflächen.

Da die Sprachbeschreibung keine ausführbaren Unterseiten deklariert, stellt Cognis Study das generierte Bibliotheksziel unter `/study/library?language=ja` bereit. Der validierte Sprachparameter bleibt an Bibliothekslinks, Detailnavigation, Direktaufrufen und im Browserverlauf erhalten; authentifizierte Lernende dürfen lesen, während die Bereichsregeln der Bibliothek das Erstellen und Veröffentlichen weiterhin schützen.

Das Inhaltspaketmanifest erfasst Herausgeber, unveränderliche Paketversion, Inhaltsrevision, Schema- und Inhaltspfade sowie die Lizenz. `schema.json` deklariert japanische Ebenen, typisierte Felder, Beziehungen, Kardinalität, Reihenfolge und Resolver. Inhaltsdateien verwenden stabile paketlokale IDs und ausdrückliche Referenzen.

Paketlokale Datensatz-IDs verwenden nur portable kleingeschriebene ASCII-Buchstaben, Ziffern, Trennzeichen und Doppelpunkte; japanische Schriftzeichen stehen in `label`, niemals in `id`. Dadurch bleibt die Übernahme mit dem Kennungsvertrag für Bibliotheksdatensätze kompatibel.

Schema und Paket teilen den Namensraum `ja`, und jede Datensatz-ID beginnt mit `ja:`. Metadaten für Schema, Ebenen, Felder und Beziehungen enthalten lokalisierte Bezeichnungen auf Deutsch, Englisch, Indonesisch und Japanisch. Semantische Rollen, typisierte Werte, Detailhinweise, Aktivitätskompatibilität, Interessensbereiche, Pflichtziele, geordnete Positionen, Löschverhalten und Resolver-Rollen ermöglichen Cognis neutrale Oberflächen und die Durchsetzung des vollständigen Vertrags.

Das externe Modulmanifest veröffentlicht `/static/modules/study-language-ja/languages`, damit Cognis Marketplace-Metadaten vor dem Modul-Bootstrap übersetzen kann.

Die veröffentlichte Sprachbeschreibung stellt sowohl den kanonischen `code`-Wert `ja` als auch den kompatiblen `languageCode`-Wert bereit. Cognis PR #215 verwendet diesen Code, um die aktive Sprachschaltfläche zu kennzeichnen und die ausgewählte Sprache beim Öffnen eines Ziels der Study-Unternavigation im Routerverlauf zu erhalten.

Die Wörterbuch-Ebene `definitions` deklariert moduleigene Definitionslokalisierung mit stabilen Zeichenkettenschlüsseln `japanese:definitions:*` und einem typisierten Feld `localizedText`. Jede vorinstallierte Definition enthält deutschen, englischen, indonesischen und japanischen Text, sodass Verbraucher Anzeigezeichenketten ohne Sprachdaten aus Cognis Core auflösen können.

## Aussprache-Audio und Partikeln

Atomare und zusammengesetzte Schrifteinheiten stellen erforderliche Aussprachelisten und ein optionales Audio-Uploadfeld bereit. Das Paket veröffentlicht keine externen Platzhalter-URLs mehr; die Library akzeptiert nur als authentifizierte Paket-Assets mitgelieferte Audiodateien. Die eigene Partikelebene speichert Metadaten zur grammatischen Funktion, und Satzdatensätze können geordnete Wort- und Partikelverweise bewahren.

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

Ein Kanji mit einer Aussprache verknüpft direkt geordnete atomare Kana. Ein Kanji mit mehreren Aussprachen verwendet genau einen ausgeblendeten `reading:kanji`-Vokabeldatensatz je Lesung; dieser verknüpft seinen Titel über `spelling` mit dem einzigen Quell-Kanji und rekonstruiert seine Aussprache über geordnetes `reading-kana`. Direkte Definitionsverknüpfungen machen Aussprache-Deep-Links eigenständig: Bei identischer Bedeutung werden die Definitionen des Quell-Kanji wiederverwendet, bei engerer Bedeutung lesungsspezifische Definitionen. Für eine zusammengesetzte Gesamtaussprache wie `せんせい` darf kein Lesungsdatensatz entstehen; Komposita verwenden getrennte Segmente wie `せん` und `せい`.

## Kontextbezogene Lesungsdefinitionen

Ausgeblendete Wortschatz-Lesungseinträge erhalten eine eigene Definition in allen vier Sprachen, wenn eine Lesung grammatisch oder lexikalisch enger als ihr Ursprungs-Kanji verwendet wird, etwa `にん` als Personenzähler oder `じん` als Nationalitätssuffix. Cognis darf die lokalisierte Definition einer Ausgangskarte nur übernehmen, wenn ein Link zu einem verwandten Eintrag Wortschatz ohne eigene Definition öffnet; deklarierte Definitionen haben immer Vorrang, und Titelkompositions- sowie Vor-/Zurück-Navigation übertragen keinen Rückfallkontext.

## Erweiterter Kerndatensatz

Das Paket enthält nun mehr als dreißig zusätzliche alltägliche Wortschatzeinträge, zehn weitere Partikeln und acht vollständig zusammengesetzte Beispielsätze, ausschließlich als deklaratives JSON unter `data/library/content/`. Echte Polysemie darf mehrere lokalisierte Definitionsverweise in einem Eintrag verwenden (`なおす`: reparieren/korrigieren), während Homophone wie `はし` (Brücke/Essstäbchen), `あめ` (Regen/Bonbon), `かみ` (Papier/Haar/Gottheit) und `はな` (Blume/Nase) getrennte Wortschatzeinträge mit eigenen Definitionen bleiben.

## Kanji-basierter Kerngraph

Der kompakte Kern verwendet nun durchgehend die üblichen Kanji-Schreibweisen. Sätze verweisen auf sichtbaren Wortschatz, sichtbarer Wortschatz auf seine Kanji und verborgenen Ausspracheabschnitte, und jeder verborgene Abschnitt wird aus atomaren Kana rekonstruiert. So wird `私は学生` über `私` → `わたし` → `わ`・`た`・`し` und `学生` → `がく`・`せい` → atomare Kana aufgelöst.

## Neueste Datensatzsteuerung aus PR 226

Die Anbieterdaten entsprechen nun dem neuesten Normalisierungsvertrag der Study Library: Definitionen sind ausgeblendete `definition`-Datensätze, Sätze sind `composite`-Datensätze und Partikeln sind unveränderliche `particle`-Datensätze mit `editable: false`. Lexikalische und Lesungsklassen bleiben anbieterneutral und namensraumgebunden.

## Zusammensetzung flektierender Kana

Vollständige verborgene Lesungen unterscheiden nun bedeutungstragende Lesungsabschnitte von nichtlexikalischen Kana-Endungen. `なおす` setzt `なお` über das verborgene Lesungswort für `直` zusammen und verknüpft `す` über die reine Kompositionsbeziehung `reading-kana` direkt mit dem atomaren Kana. Dadurch erscheint eine Teilendung nicht mehr als alternative Aussprache der Karte.

## Deduplizierte Eltern von Lesungen

Wortschatz mit einem einzelnen Kanji verwendet nun einen verborgenen Wrapper für die vollständige Aussprache, bevor der Kanji-Lesungsdatensatz erreicht wird. Bei `猫` verweist die sichtbare Wortkarte auf verborgenes `ねこ`, das sich aus der Kanji-Lesung zusammensetzt; auch das Kanji verweist auf diese Lesung. Die Liste „Verwendet von“ enthält dadurch unterschiedliche Eltern `猫` und `ねこ` statt zweier nicht unterscheidbarer `猫`-Karten.

## Verknüpfte Satzlesungen und geprüfte Übungsserie

Jede Satzaussprache öffnet nun einen verborgenen vollständigen Lesungsdatensatz, dessen Abschnitte über vorhandenen verborgenen Wortschatz und atomare Partikel-Kana aufgelöst werden; unverknüpfter Aussprachetext ist nicht mehr der Standard. Acht geprüfte Sätze ergänzen abwechslungsreiche Übungen zu Wassertrinken, Japanischlernen, Reisen, Tieren, Größe und Gehen sowie die vollständig verknüpften Wörter `学ぶ` und `歩く`.

## Direkt mit Kana verknüpfte Lesungstitel

Ausgeblendete Aussprachedatensätze setzen ihre Titel jetzt über die reine Kompositionsbeziehung `reading-kana` direkt aus atomaren Kana zusammen. Das Öffnen einer Kanji-Aussprache führt daher zu einzeln verknüpften Kana, statt über eine weitere Lese- oder Kanji-Karte zurückzuführen; im Titel wird außerdem kein Detail zur alternativen Schreibweise mehr angezeigt.

## Kanonischer Kartengraph

Das Inhaltspaket enthält nur den aktiven kanonischen Graphen. Jede Kanji-Aussprache verweist auf einen eigenen reinen Kana-Lesungsdatensatz; die vollständige Aussprache eines Wortes bleibt getrennt und kann Flexions-Kana ergänzen. So wird `好` als `す` aufgelöst, während `好き` diese Lesung mit `き` ergänzt.

## Direkte Kana-Verwendungsnavigation

Die Liste „Verwendet von“ eines Kana enthält nur unmittelbare Lesungsdatensätze. Kanji verweisen nie direkt auf atomare Kana: Lernende folgen `あ` → `あめ` → `雨`, sodass nicht verwandte Wörter und Kanji, die lediglich `あ` enthalten, nicht als direkte Eltern erscheinen.

## Vom Elterneintrag bestimmte zusammengesetzte Aussprachen

Nur Satzkarten besitzen die Zusammensetzung aus Wörtern und Partikeln. Ein Satz wie `猫が好き` verweist auf sichtbares `猫`, `が` und `好き`; jedes sichtbare Kanji-Wort verweist auf seine eine vollständige Kana-Aussprache (`ねこ` oder `すき`), die sich anschließend in atomare Kana auflöst. Vollständige Kana-Lesungen bilden niemals eine parallele Satzkette.

## Mit Vokabeln verknüpfte Satzlesungen

Die Aussprache eines Satzes verwendet die bereits geordnete `words`-Beziehung für Deep-Links in den Titeldetails. Jeder vollständige Kana-Abschnitt öffnet damit den sichtbaren Vokabeleintrag des Wortes, während Partikeln Bestandteile des Satzes bleiben; die Vokabel führt anschließend nur über ihre eigene vollständige Lesung zu atomaren Kana und nie zu benachbarten Satzkindern.

## Kanji-Lesungen zu Vokabeln

Ein Kanji mit einer Aussprache verknüpft direkt geordnete atomare Kana. Ein Kanji mit mehreren Aussprachen verwendet genau einen ausgeblendeten `reading:kanji`-Vokabeldatensatz je Lesung; dieser verknüpft seinen Titel über `spelling` mit dem einzigen Quell-Kanji und rekonstruiert seine Aussprache über geordnetes `reading-kana`. Direkte Definitionsverknüpfungen machen Aussprache-Deep-Links eigenständig: Bei identischer Bedeutung werden die Definitionen des Quell-Kanji wiederverwendet, bei engerer Bedeutung lesungsspezifische Definitionen. Für eine zusammengesetzte Gesamtaussprache wie `せんせい` darf kein Lesungsdatensatz entstehen; Komposita verwenden getrennte Segmente wie `せん` und `せい`.

## Vollständig verknüpfte Satzaussprache

Die Aussprachedetails eines Satzes verwenden den aktuellen `linkRelationships`-Vertrag und deklarieren sowohl `words` als auch `particles` als Linkquellen. Die Lesung `がっこうにいく` verknüpft ihre vollständigen Abschnitte daher mit dem sichtbaren `学校`, der Partikel `に` und dem sichtbaren `行く`, ohne einen parallelen Satzleseeintrag einzuführen.

## Strichgeführte Schreibübungen

Jede Kana- und Kanji-Karte enthält nun ein erforderliches `strokePattern` mit normalisierten Koordinaten, geordneten monotonen Zeitwerten und einer Übungstoleranz, die mit dem aktuellen Zeichenvertrag der Study Library aus Cognis PR #226 kompatibel ist. Die Muster werden direkt aus den nach Unicode benannten KanjiVG-Pfaden mit kurventreuer Abtastung neu erzeugt, sodass Wendungen und Schleifen dem angezeigten Zeichen entsprechen. Quelle und CC-BY-SA-3.0-Namensnennung bleiben im Inhaltsmanifest erhalten.

## Laufzeit-Anbieter für Strichmuster

Das Modul registriert `study-language-ja:stroke-patterns` über die Library-Fähigkeit `study:library:provider`. Exakte paketierte Kana- oder Kanji-Bezeichnungen liefern sofort das geprüfte `stroke_pattern`. Jedes andere japanische Kana oder Kanji wird aus der kanonischen KanjiVG-SVG-Quelle geladen, in normalisierte Striche mit Zeitwerten umgewandelt, für die Sitzung zwischengespeichert und mit Herkunft und voller Konfidenz zurückgegeben. Nichtjapanische oder nicht verfügbare Zeichen werden nicht erraten; OCR wird nie verwendet, und der Anbieter wird beim Deaktivieren des Moduls sauber entfernt.

## Jisho-gestützte Kartenerstellung

Das Modul registriert einen lokalisierten **Jisho-Wörterbuch**-Anbieter direkt über den generischen Vertrag `study:library:provider.registerLookupProvider` für den Composer von Kana-, Kanji- und Vokabelkarten. Exakte Treffer werden zuerst aus dem mitgelieferten Datensatz einschließlich aller gepflegten Felder und Beziehungen aufgelöst. Nur ein Cache-Fehltreffer fragt Jisho ab; laufende und abgeschlossene erfolgreiche Antworten werden in einem begrenzten Sitzungscache gemeinsam genutzt. Externe Ergebnisse befüllen die kanonische Bezeichnung, Aussprachen, die JLPT-Stufe (falls vorhanden) und Links zu vorhandenen Kanji, vollständigen Lesungen oder atomaren Kana, ohne Datensätze oder Verknüpfungen zu erfinden.

Der SVG-Pfad-Sampler gehört zum Modul, sodass installierte externe Module nicht von den `node_modules` des Hosts abhängen.

Bootstrap bezieht den inversen Anbieter über `ctx.capabilities.require("study:library:provider")` und folgt damit dem Registrierungsmuster der Authentifizierungsanbieter; der veraltete Komfort-Getter wird nicht verwendet.

Während der Einführung von Cognis PR #226 bevorzugt Bootstrap die injizierte öffentliche Fähigkeit `study:library:provider` und verwendet andernfalls den bereits injizierten Dienst `study:library`, der dieselbe generische Oberfläche aus `registerLookupProvider` und `ingestContentPack` implementiert. Dadurch besteht keine Abhängigkeit von der Sichtbarkeit des System-ctx, während ein einziger Anbietervertrag erhalten bleibt.

## Geprüfte Links in Titeldetails

Jede Satzaussprache wird nun gegen den Titeldetail-Resolver des Hosts geprüft, sodass jeder Kana-Abschnitt seinen geordneten Vokabel- oder Partikeleintrag öffnet. Jedes Kanji stellt eine eindeutige vollständige Primärlesung bereit, die exakt zum angrenzenden Vokabelziel passt; weitere Lesungen bleiben über eine separate Nicht-Titel-Beziehung verfügbar, und alle Kana-Abhängigkeiten bleiben für die inverse Navigation sichtbar.

## Aktueller abgeleiteter Aussprachegraph

Ein Kanji mit einer Aussprache verknüpft direkt geordnete atomare Kana. Ein Kanji mit mehreren Aussprachen verwendet genau einen ausgeblendeten `reading:kanji`-Vokabeldatensatz je Lesung; dieser verknüpft seinen Titel über `spelling` mit dem einzigen Quell-Kanji und rekonstruiert seine Aussprache über geordnetes `reading-kana`. Direkte Definitionsverknüpfungen machen Aussprache-Deep-Links eigenständig: Bei identischer Bedeutung werden die Definitionen des Quell-Kanji wiederverwendet, bei engerer Bedeutung lesungsspezifische Definitionen. Für eine zusammengesetzte Gesamtaussprache wie `せんせい` darf kein Lesungsdatensatz entstehen; Komposita verwenden getrennte Segmente wie `せん` und `せい`.

Ein Kanji mit einer Aussprache verknüpft direkt geordnete atomare Kana. Ein Kanji mit mehreren Aussprachen verwendet genau einen ausgeblendeten `reading:kanji`-Vokabeldatensatz je Lesung; dieser verknüpft seinen Titel über `spelling` mit dem einzigen Quell-Kanji und rekonstruiert seine Aussprache über geordnetes `reading-kana`. Direkte Definitionsverknüpfungen machen Aussprache-Deep-Links eigenständig: Bei identischer Bedeutung werden die Definitionen des Quell-Kanji wiederverwendet, bei engerer Bedeutung lesungsspezifische Definitionen. Für eine zusammengesetzte Gesamtaussprache wie `せんせい` darf kein Lesungsdatensatz entstehen; Komposita verwenden getrennte Segmente wie `せん` und `せい`.

Die Wortschatzsuche akzeptiert außerdem begrenzte englische Suchbegriffe wie `mythical cat`; wenn keine japanische Schreibweise exakt mit der Anfrage übereinstimmt, verwendet der Provider Jishos höchstbewertetes Ergebnis. Die Kana- und Kanji-Suche bleibt auf die exakte Eingabe eines einzelnen japanischen Zeichens beschränkt.

## Transformationsansichten für Verben und Adverbien

Der Wortschatz trennt jetzt Grundformen von Verben und Adverbien von gewöhnlichen Karten. Geprüfte Konjugationsfamilien-Tags leiten Höflichkeits-, Verneinungs-, Vergangenheits- und Te-Formen für Ichidan-, Godan-, Ausnahme- und unregelmäßige Verben ab, ohne doppelte Lerndatensätze anzulegen. Japanische Adverbien bleiben unverändert und zeigen nur ihre Grundkarte; erzeugte Formen dienen ausschließlich der Darstellung.

## Satzverknüpfungen ohne vorgetäuschte Satzvokabeln

Die Satzaussprache verknüpft über `linkRelationships: ["words", "particles"]` jeden geordneten Leseabschnitt mit seinem vorhandenen sichtbaren Vokabel- oder Partikelbestandteil. Vollständige Satzaussprachen dürfen niemals als Vokabeldatensätze gespeichert werden; Vokabeln dürfen außerdem keine Satz-, Komposit- oder Partikelstrukturen enthalten.

## Selektive Zwischenkarten für Kanji-Lesungen

Ein Kanji mit einer Aussprache verknüpft direkt geordnete atomare Kana. Ein Kanji mit mehreren Aussprachen verwendet genau einen ausgeblendeten `reading:kanji`-Vokabeldatensatz je Lesung; dieser verknüpft seinen Titel über `spelling` mit dem einzigen Quell-Kanji und rekonstruiert seine Aussprache über geordnetes `reading-kana`. Direkte Definitionsverknüpfungen machen Aussprache-Deep-Links eigenständig: Bei identischer Bedeutung werden die Definitionen des Quell-Kanji wiederverwendet, bei engerer Bedeutung lesungsspezifische Definitionen. Für eine zusammengesetzte Gesamtaussprache wie `せんせい` darf kein Lesungsdatensatz entstehen; Komposita verwenden getrennte Segmente wie `せん` und `せい`.

## Tief verzweigte Transformationen

Verbtransformationssätze bilden nun tief verzweigte Pfade aus jeder kanonischen Grundkarte. Die Zweige umfassen höfliche Negativ- und Vergangenheitsformen, verneinte Vergangenheit und Verbindungsformen, Kausativ, Passiv, Potential, Volitional sowie mehrstufige Kausativ-Wunschketten. Jede Regel transformiert Schriftform und Aussprache unabhängig; lokalisierte Definitionsüberschreibungen erklären semantische Zweige. Adverbien bleiben unveränderliche kanonische Grundkarten, und keine erzeugte Form wird als Vokabeleintrag gespeichert.

Verbtransformationen verwenden den Cognis-2.24-Vertrag `definitionTransform`. Jede lokalisierte Regel deklariert eine entfernbare Definitionsgrenze und eine Vorlage mit `{{ definition }}`, `{{ stem }}`, `{{ prefix }}` oder `{{ suffix }}`; Vorlagen werden entlang tiefer Pfade zusammengesetzt. Gespeicherte Definitionen bleiben normaler Text ohne Transformationsplatzhalter. Dadurch behält `見る` getrennte Definitionen für „sehen“ und „anschauen“, während der Wunschpfad beide passend transformiert.

Kontextabhängige Zweige verwenden lokalisierte geordnete `replacements` vor ihren Ausweichvorlagen. Spätere Regeln können dadurch eine frühere Anmerkung umschreiben; Verbindungsregeln hängen ihre Bedeutung dagegen mit `{{ definition }}` an die vollständig transformierte Definition an.

Strichmuster veröffentlichen nun ausdrückliche logische Spalten und geordnete Strichgruppen pro Zeichen. Der seitenverhältnistreue Cognis-Zeichenbereich kann zusammengesetzte Zeichen ohne Verzerrung dimensionieren, beabsichtigte Abstände erhalten und den nächsten Strich an der richtigen Zeichengrenze prüfen.

### Identität bei der Kanji-Erstellung

Kanji-Erstellung und native Suche verwenden das NFKC-normalisierte Kanji-Zeichen als Kartenidentität, niemals seine Aussprache. Verschiedene Zeichen dürfen daher dieselbe Lesung wie `けん` besitzen, ohne als dieselbe Karte behandelt zu werden. Cognis Library 2.24.3 liefert bei einem echten Konflikt desselben Zeichens die ID des vorhandenen Eintrags und ermöglicht dem Composer, diese Karte auszuwählen, auch wenn sie außerhalb der aktuellen Filterliste liegt.

### Composer für Satzstrukturen

Der Satzkarten-Konstruktor veröffentlicht nun getrennte anbietereigene Karussells für gewöhnliche Wörter, Partikeln, markierten Satzstruktur-Wortschatz und wiederverwendbare japanische Satzzeichen. Die sichtbare Kopula `です` trägt `sentence-structure`; sie bleibt damit bedeutungsvoller Wortschatz und erscheint zugleich in der mit Cognis Library 2.24.9 eingeführten Satzbau-Steuerung.

### Erweiterte Konnektoren und Kopula

Das Satzstruktur-Karussell enthält nun `それでも`, `ですが`, `だけど`, `しかし`, `そして`, `それから`, `だから`, `なので` und das einfache `だ`, jeweils mit Ausspracheverknüpfungen zu atomaren Kana, lokalisierter Bedeutung und einem geprüften Beispielsatz. Eine eigene Transformationsansicht für Kopulas erweitert die Grundform `だ` zu `だった`, `ではない`, `ではなかった` und der Verbindungsform `で`, ohne diese erzeugten Formen als Vokabelkarten zu speichern; das sichtbare höfliche `です` bleibt ein eigenständig verfasstes Satzstrukturwort.
