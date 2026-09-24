# Bereichsbezogene Study-Bibliothek

**Feature Branch:** work

## Mehrschichtige Bibliothek

Die Bibliothek aus Paketdateien wurde durch die datenbankgestützte Study-Bibliothek aus Cognis PR #196 ersetzt. Sie bietet neun validierte Ebenen, Referenzverfolgung, bereichsbezogenen Zugriff, JSON- und Anki-Austausch sowie geprüfte Push-Anfragen.

## Bibliotheksbrowser

Die lokalisierte Bibliotheksseite wurde aktualisiert, um gefüllte globale Ebenen mit dem Seiten-Composer des Hosts zu durchsuchen.

## Auswählbare Vorlagen

Verbraucher können nur die benötigten Ebenen der kanonischen Bibliotheksvorlage kopieren. Beziehungsmetadaten erhalten gültige Verknüpfungen und erforderliche Abhängigkeiten, während bei der Erstellung von Wörtern und Sätzen passende Verknüpfungen abgeleitet werden können.

## Moduleigene API-Routen

Alle Bibliotheksendpunkte wurden in den moduleigenen API-Namensraum verschoben, damit Cognis das Modul aktivieren kann, ohne geschützte Routen des Study-Gateways abzulehnen.

## Lokalisierte Study-Navigation

Die japanische Study-Unternavigation wurde auf der Bibliotheksseite wiederhergestellt, alle drei Bezeichnungen der Unterseiten werden aus dem Modul-Bündel lokalisiert und Klicks werden auf jeder japanischen Study-Seite über den Cognis-Host-Router geleitet.

## Deklaratives japanisches Inhaltspaket

Das Modul wurde an den überarbeiteten Cognis-Library-2.1-Vertrag angepasst. Japanische Daten werden nun als versioniertes Schema und deklarativer Inhaltsgraph geliefert und über `study:library` übernommen. Validierung, Persistenz, Routen und generierte UI gehören dem Host; daher wurden der duplizierte Bibliotheksdienst, die Datenbank, APIs und Seiten des Moduls entfernt.

## Fähigkeitsbasierte Bibliotheksabhängigkeit

Die UUID des Bibliotheksadapters wurde aus den Komponentenabhängigkeiten entfernt, da Study-Adapter keine eigenständig installierbaren Komponenten sind. Das Modul hängt nun vom Study-Gateway ab und erkennt die Bibliothek ausschließlich über die erforderliche Fähigkeit `study:library`.

## Portable Inhaltskennungen

Kanji-Zeichen in Datensatz-IDs wurden durch stabile ASCII-Kennungen ersetzt, während die Zeichen als Bezeichnungen erhalten bleiben. Anschließend wurden Paketversion und Inhaltsrevision erhöht, damit die korrigierten Bytes sicher übernommen werden können.

## Sprachbezogene generierte Navigation

Die deklarative japanische Beschreibung wurde an Cognis PR #196 und #213 angepasst und deklariert ausdrücklich keine ausführbaren Unterseiten. Study stellt nun das generierte, für Lernende sichtbare Bibliotheksziel bereit und erhält den validierten Sprachkontext `ja` beim Browsen und in der Verlaufnavigation.

## Versionierter neutraler Schemavertrag

Die Anpassung an Cognis PR #214 ergänzt Namensraumeigentum, lokalisierte Schemametadaten, semantische Ebenenrollen, erweiterte Feldtypen, Detailhinweise, Aktivitäts- und Interessens-Tags, erforderliche Beziehungsziele, ausdrückliches Löschverhalten, Resolver-Rollen und streng positionierte geordnete Referenzen. Die Sprachbeschreibung veröffentlicht nun die unveränderliche Paketidentität.

## Strikte Kleinbuchstaben-IDs für Inhalte

Die Katakana-Datensatz-IDs verwenden jetzt ausschließlich kleingeschriebene ASCII-Zeichen, sodass der Host jeden Datensatz akzeptiert, statt die Aktivierung mit `invalid_content_record` abzubrechen. Paketversion und Inhaltsrevision wurden erhöht, damit Cognis die korrigierten Daten erneut einliest.

## Erneute Veröffentlichung mit strikter Vorabprüfung

Das korrigierte Paket wurde als Version `2.1.2` mit Inhaltsrevision `2026-09-05.4` erneut veröffentlicht, damit Installationen keine zwischengespeicherten fehlerhaften Paketbytes wiederverwenden. Die eigenständigen Tests prüfen nun genau die Host-Voraussetzungen für String-IDs, den Präfix `ja:`, kleingeschriebene portable Zeichen und nicht leere String-Bezeichnungen.

## Sprachcode für die Study-Unternavigation

Die Sprachbeschreibung veröffentlicht nun den kanonischen Wert `code: "ja"` zusätzlich zum kompatiblen `languageCode`. Damit kann Cognis PR #215 die erzeugte aktive Sprachschaltfläche mit dem japanischen Sprachcode versehen und die Auswahl ohne URL-Abfrageparameter im Routerverlauf an nachfolgende Study-Ziele übergeben.

## Auflösbare lokalisierte Wörterbuchdefinitionen

Die Ebene `definitions` entspricht nun dem Wörterbuchvertrag aus Cognis PR #196. Sie deklariert `definitionLocalization`, stabile moduleigene Zeichenkettenschlüssel und ein typisiertes Feld für lokalisierte Texte. Alle vorinstallierten Definitionen enthalten deutsche, englische, indonesische und japanische Zeichenketten; Schema und Paket wurden für die unveränderliche Strukturänderung auf Version `3` beziehungsweise `2.2.0` erhöht.

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

## Commits

- [a6fa75d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a6fa75d15c478b1d8ef1930dcc3c5c29e3938b97)
- [33cf20c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/33cf20c040c55a177efe83fa6d14674491da2254)
- [ddd8464](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddd84646f1930ea660f469e4b1776219558e1e5b)
- [7048e41](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7048e4155bb52132741016c35371f0e0c215d67e)
- [131afdf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/131afdf5125a3eebae584a2c4729bd0a1b144654)
- [db6df0a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/db6df0a0d71e75892cac726991ab0d5fa9edf172)
- [530fdfd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/530fdfdb7cb55b05d316d404ab8e64c33ba0b04c)
- [549322e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/549322e5e597f186c36ada77d330921e7b335a4d)
- [1740b0b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1740b0b0da93d15c450ca82c452bb1fe8698b7e9)
- [4639371](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4639371d8fe55c71477aa70087cc4e8a18100438)
- [e9ae382](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e9ae382be9ed7fd23b4a323f081904ad9137410f)
- [92032ec](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/92032ecd30c7bee0dbcb76007108ef12e6a892e8)
- [b9f3e6e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b9f3e6eb6813d99d5ee76902729bc478fe36afd1)
- [90bac12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/90bac12fb8d4c90451b6a0ae2e9c0572be99cbd0)
- [4a0b288](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4a0b28830b5a1d6fcea2df490e74e99108d1e4dd)
- [32b43de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32b43dec923a4fc7a62401bb21b5b01259cb311e)
- [c7a745f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c7a745f39078cb5cb4d4206ce20a855aed195a22)

- [5ab8006](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5ab80067e1e3151a86f648cedf7660167a1f6f15)

- [32ac841](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32ac8416bbf3676b3cecdde536e645e24941f81a)

- [ed1fd35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ed1fd35e5235f79773ba91bd1d28377365509e2b)

- [e5c86a4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5c86a4cf17408e92c5021015ff4404c2e5802b6)

- [2a56248](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2a562481c79002aa62a1ab51de91b7543c1acd18)

- [f6ace9e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f6ace9e86c0c27634edeba5ffb98e429bfd2be4f)

- [64682aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64682aa25ecd32bf106613dec2b8a26812e1fba5)

- [06f4b09](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/06f4b09449d44ca464c31f11464fd474bddf4fcd)

- [0912c79](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0912c79cff5ba0fce67cd2c9ec6e10da11331a64)

- [a8e559e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a8e559e3bfad5bbf1c1778dd4a9505c83bc04f8d)

- [7f8cc35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7f8cc35b43f92480c77dba4807bf4f237e4ebd8d)

- [e5eae65](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5eae656076a0bcb31c74e7f388c06b4ed790815)

- [6677a4f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6677a4f80b97c2d3f056b189002e2c0f30f88e22)

- [b314603](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b314603e775c02a12ee16c3c718618a4077125bc)

## Filtergebundene Kana-Lücken

Die vier ausdrücklichen Tabellenlücken werden von den entsprechenden Hiragana- und Katakana-Rasterpositionen gemeinsam genutzt. Durch das abwechselnde Anordnen der jeweiligen Schriftzeichen kann der Bibliotheksfilter die inaktive Schrift entfernen, ohne deren Lücken am Anfang oder Ende der ausgewählten Tabelle stehen zu lassen.

- [eaae470](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eaae470ad48226b0f1c3e931748511eae7178bb1)

## Vollständiger Kana-Löschgraph

Der Wortschatzeintrag `好き` deklariert jetzt seine geordnete Kana-Schreibweise aus `す` und `き`. Damit gehört er wie jeder andere Wortschatzeintrag zum Referenzabhängigkeitsgraphen und wird einbezogen, wenn Cognis eine kaskadierende Löschung der Kana-Tabellen anzeigt oder ausführt.

- [408a5c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/408a5c957033a9200286e9fed7e9a6d0fbfa3873)

## Stabile Identitäten für Kana-Varianten

Das Paket wird für die neuesten Identitätsschutzmaßnahmen der Bibliothek neu veröffentlicht. Jeder Kana-Datensatz besitzt eine eigene Inhaltsidentität, und jeder Variantenverweis zielt auf einen anderen übergeordneten Datensatz. Dadurch kann eine erneute Aufnahme veraltete Kanten neu aufbauen, ohne ein Elternzeichen als sein eigenes Kind darzustellen.

- [01606c4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/01606c49ade781db72f6652ca779517732eed7a6)

## Explizite Kana-Kindhierarchien

Die Kana-Elternbeziehungen entsprechen jetzt dem neuesten Bibliotheksvertrag und sind sowohl als Varianten als auch als räumliche Kinder markiert. Da der doppelte Beziehungsabschnitt unterdrückt wird, ist das ausdrückliche Feld `usage_note` nicht mehr nötig und wurde zusammen mit seinen vier Datensatzwerten entfernt.

- [6734506](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/67345060175f87f4a73e1f07598efcb2df814edb)

## Kanonischer Wortschatz für Kanji-Lesungen

Der doppelte lexikalische Datensatz `人` wurde entfernt. Der Kanji-Eintrag verweist jetzt nur auf seine unterschiedlichen Wortschatzlesungen `じん`, `にん` und `ひと`; jede Lesung setzt sich aus passenden Hiragana-Datensätzen zusammen und besitzt einen eigenen direkten Definitionsverweis.

- [986261f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/986261f57188d939eb014e4f07eb2d90ed85059d)

## Modulbesitzvertrag aus PR 220

Das Modul fordert jetzt ausdrücklich vertrauenswürdige Privilegien an, weil es die standardisierte Fähigkeit `study:language:ja` außerhalb seines moduleigenen Namensraums veröffentlicht. Die Repository-Herkunft von Cognis Labs ermöglicht dem Host die Prüfung dieser Anfrage; der Bibliothekszugriff bleibt fähigkeitsbasiert und alle Registrierungen bleiben an den Lebenszyklus gebunden.

- [d1efe4b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d1efe4b52184c4cdc77843441c2dfa7948339afe)

## Nächstgelegene deklarierte Bibliotheksbeziehungen

Kompositionen verwenden jetzt die nächstgelegenen Datensätze: `日本語` verweist auf das Wort `日本` und das Kanji `語`, während `日本` auf die Kanji `日` und `本` verweist. Geordnete Kana-Alternativschreibweisen stellen direkte Aussprache-Links bereit, und jedes Feld deklariert sein anbietereigenes Editor-Steuerelement und lokalisierte Optionen.

- [8e8323e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8e8323e9d435685a54cbdd0ae87b56391d637ff2)

## Direkte Kana-Links für Kanji-Aussprachen

Kanji-Karten mit mehreren Lesungen lösen nun jede angezeigte Aussprache direkt in ihre zugehörigen Hiragana-Einträge auf. Wortschatz-Lesungseinträge bleiben für Definitionen und Übungen verfügbar, ohne rekursive Aussprache-Links zu erzeugen.

- [f3faf6c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3faf6ccbd41bd5709996a9b7d6fb31174a2c437)

## Ausgeblendeter Kanji-Lesungswortschatz

Kanji-Aussprachen verweisen nun jeweils auf einen vollständigen Wortschatz-Lesungseintrag, der wiederum auf seine geordnete atomare Kana-Schreibweise verweist. Reine Lesungseinträge werden im Browser ausgeblendet, bleiben aber direkt verlinkbar; alle gewöhnlichen Wortschatzeinträge bleiben sichtbar.

- [cb5c46a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cb5c46a541006afea645504178fd86f788b4565f)

## Deklarierte Ausspracheabschnitte für Komposita

Festgelegte Komposita-Aussprachen verlinken nun über die größten deklarierten ausgeblendeten Lesungseinträge statt direkt über atomare Kana. `日本語` löst `にほんご` als die `日本` zugeordnete ausgeblendete Lesung `にほん` gefolgt von der `語` zugeordneten Lesung `ご` auf; diese Einträge lösen anschließend zu geordneten Kana auf.

- [eff02dd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eff02dd26396e0198e63e51b24758701f05d00d2)

## Kontextbezogene Wortschatzdefinitionen

Ausgeblendete Kanji-Lesungswörter besitzen nun Definitionen in vier Sprachen für engere Verwendungen wie den Personenzähler `にん` und das Nationalitätssuffix `じん`, statt breite Kanji-Bedeutungen wiederzuverwenden. Der Autorenstandard beschränkt Cognis' Rückfall auf die Quelldefinition auf wirklich identische Bedeutungen, die über verwandte Einträge erreicht werden, da Titelkomposition und Vor-/Zurück-Navigation diesen Kontext absichtlich löschen.

- [d52fcb2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d52fcb2578d7854a9e36361a5077dc2276e05115)

## Deutlich erweiterter deklarativer Datensatz

Mehr als dreißig alltägliche Wortschatzeinträge, zehn Partikeln und acht vollständig zusammengesetzte Sätze mit Definitionen in vier Sprachen wurden ausschließlich als Daten-JSON ergänzt. Echte Polysemie nutzt mehrere Definitionen in einem Eintrag (`なおす`), während Homophone wie Brücke/Essstäbchen `はし`, Regen/Bonbon `あめ` und Papier/Haar/Gottheit `かみ` getrennte Wortschatzeinträge mit unabhängigen Bedeutungen bleiben.

- [a538833](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a538833e990505cad9b817cb9995b1cf2b8bab5e)

## Geprüfter Kern und Kana-Verknüpfungen wiederhergestellt

Die ungeprüften umfassenden Partikel-, generierten Kanji-, Satz- und Lesungserweiterungen wurden entfernt und das Paket auf seinen kompakten geprüften Bestand zurückgeführt. Jeder beibehaltene Datensatz trägt nun seine Vertragsklasse und besteht ebenenspezifische Verknüpfungsprüfungen. Kana-basierte Karten bleiben Kana: `せんせい` verknüpft direkt mit `せ`, `ん`, `せ` und `い`; eine getrennte Lehrer-Lesungskarte wird nicht angezeigt.

- [70b6951](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/70b6951274722f1506bb75dfd9db0bc808f70651)

## Vollständiger Pfad von Kanji bis Kana

Jeder sichtbare Wortschatzeintrag des Kernbestands verwendet nun seine übliche Kanji-Form und ist über den vollständigen verfassten Graphen verbunden. Sätze verweisen nur auf sichtbaren Wortschatz und Partikeln; Wortschatz verweist auf Kanji und verborgene Lesungsabschnitte; verborgene Lesungen werden aus geordneten atomaren Kana rekonstruiert. `私は学生` folgt nun `私` → `わたし` → `わ`・`た`・`し`, `は` und `学生` → `がく`・`せい` → `が`・`く`・`せ`・`い`. Regressionstests lehnen jede übersprungene Ebene ab.

- [65ff45a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/65ff45affebb7a647d7ee3012eb9e8999e4de7b0)

## Neueste Datensatzsteuerung aus PR 226

Die Anbieter-Datensätze wurden an den neuesten Vertrag für externe Pakete der Study Library angepasst. Definitionen sind ausdrücklich ausgeblendet und verwenden die hostreservierte Klasse `definition`, Sätze verwenden `composite` und Partikeln verwenden `particle` mit `editable: false`. Vertragstests prüfen diese normalisierten Werte vor der Aufnahme, damit installierte Datensätze und Anbieter-Hashes übereinstimmen.

- [e74c036](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e74c0362e8a1fb9e15bdc58b80c2e1c7eb0d07f3)

## Korrekte Zusammensetzung flektierter Lesungen

Vollständige verborgene Lesungen verwenden nun für nichtlexikalische Kana-Endungen die reine Kompositionsbeziehung `reading-kana`, statt ein unvollständiges `kana-spelling` als alternative Aussprache zu missbrauchen. Die Lesung `なおす` setzt das bedeutungstragende `なお` über das verborgene Lesungswort von `直` zusammen und verknüpft die einzelne Endung `す` direkt mit atomarem Kana. Die Karte zeigt daher nicht mehr nur die zweite Hälfte als Aussprache.

- [1bb8457](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1bb84576d96472bba37b33163a9fbc3b292954ab)

## Deduplizierte Eltern von Lesungen

Lexikalische Datensätze aus einem einzelnen Kanji verweisen nun auf eigene verborgene Wrapper für die vollständige Aussprache, die sich aus dem zugrunde liegenden Kanji-Lesungswort zusammensetzen. Eine Lesung wie `ねこ` wird dadurch vom Kanji `猫` und einem anders bezeichneten verborgenen Wrapper `ねこ` verwendet, statt von zwei optisch identischen `猫`-Karten. Ein Regressionstest des gesamten Graphen lehnt gleich bezeichnete Eltern für jede verborgene Lesung ab.

- [d5c257d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d5c257df1f91978090c7e9ea9f85ded883847c06)

## Vollständig verknüpfte Satzaussprachen

Jede Satzaussprache wird nun über einen verborgenen Datensatz der vollständigen Aussprache aufgelöst. Lexikalische Abschnitte verwenden die nächstgelegenen verborgenen Wortlesungen, während Partikeln und andere nichtlexikalische Einzel-Kana direkt über `reading-kana` verknüpft werden; Tests lehnen nicht rekonstruierbaren Text ab. Acht geprüfte, abwechslungsreiche Übungssätze sowie die vollständig verknüpften Vokabeln `学ぶ` und `歩く` erweitern den Lernstoff ohne vorlagenartig erzeugte Füllinhalte.

- [d90876c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d90876c607bf4a34f628d27429e38264943f1c2d)

## Zyklenfreie Lesungssemantik

Der lexikalische Tageszähler `か` ist nun sichtbares Vokabular der Klasse `lexical:counter` und kein verborgener Implementierungsdatensatz für eine Kanji-Lesung. Neue Prüfungen des gesamten Graphen lehnen vorwärts gerichtete Kompositionszyklen ab und verlangen, dass Kana die Lernverknüpfung beenden. Die verbleibende Rücknavigation zwischen gleich bezeichneten Einträgen ist als Folgemaßnahme für den Study-Library-Host dokumentiert, da das Modul die notwendige Schreibbeziehung vom Wort zum Kanji beibehalten muss.

- [07f7a0c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/07f7a0c2e298debdc71965f63a380f5f84fc8c37)

## Direkte Kana-Navigation für Lesungen

Titel ausgeblendeter Aussprachedatensätze setzen sich jetzt direkt aus ihren einzelnen atomaren Kana-Links zusammen. Beim Öffnen einer Kanji-Lesung wird nicht mehr über eine weitere vom Kanji abgeleitete Lesungskarte navigiert und die alternative Schreibweise erscheint nicht mehr im Kartentiteldetail.

- [631e76b6c2471aff02f37e982ece772fe7ad266c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/631e76b6c2471aff02f37e982ece772fe7ad266c)

## Aktivierungssichere Lesungszusammensetzung

Lesungstitel verwenden jetzt die vorgesehene Kompositionsbeziehung `reading-kana`, während `kana-spelling` seine unterstützte Rolle als alternative Schreibweise behält. Dadurch bleibt die direkte Kana-Navigation erhalten, ohne dass die Inhaltsvalidierung die Modulaktivierung ablehnt.

- [2187c82db49d331797cbb015e4665ad7ccb5264b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2187c82db49d331797cbb015e4665ad7ccb5264b)

## Kanonische Vokabular- und Kana-Karten

Redundante Aussprache-Vokabularhüllen wurden entfernt. Sichtbares Kanji-Vokabular verweist nun direkt auf Kanji und atomare Kana, Kanji-Lesungen bevorzugen den passenden sichtbaren lexikalischen Eintrag wie `猫`, und verbleibende ausgeblendete Lesungen verwenden die Ausspracheklasse, statt als Kanji zu erscheinen. Kana-Karten tragen nun ein einziges Schriftsystem-Abzeichen ohne doppelten Klassen-Tag.

- [697459a2379a0d11ce7fcc1ad947dacbe7d556a3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/697459a2379a0d11ce7fcc1ad947dacbe7d556a3)

## Importierbare Inhaltsdateien

Zwei nach der Normalisierung der Lesungen verbliebene leere Vokabular-JSON-Dateien wurden entfernt. Jede erkannte Inhaltsdatei enthält nun mindestens einen Datensatz, sodass der Study-Library-Importer bei der Modulaktivierung keinen undefinierten Datensatz mehr untersucht.

- [423a3250facb90f3435fc28faee469aa63bacceb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/423a3250facb90f3435fc28faee469aa63bacceb)

## Wiederhergestellter importierbarer Lesungsgraph

Die umfassende Umgestaltung des lexikalischen Graphen, die bei der Study-Library-Aktivierung innerhalb der Datenbanktransaktion fehlschlug, wurde zurückgenommen. Das Paket verwendet wieder die zuvor importierbare geschichtete Lesungsstruktur, behält aber die unterstützte `reading-kana`-Kompositionskorrektur bei und erhält eine neue Inhaltsrevision, damit der Host den Import erneut ausführt.

- [3ab7d2577f18d204465863ce3c820b8fe153d8be](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3ab7d2577f18d204465863ce3c820b8fe153d8be)

## Inkrementelle Migration zum kanonischen Kartengraphen

Der vereinfachte Kartengraph wurde umgesetzt, ohne bereits in einer Installation vorhandene Provider-Datensätze zu löschen. Aktuelle Kanji- und Vokabularkarten verweisen direkt auf die vorgesehenen lexikalischen, Kanji- und Kana-Endpunkte; ersetzte ausgeblendete Lesungen sind getrennt, bleiben aber für sichere Datenbankaktualisierungen erhalten. Reine Lesungskarten tragen nicht mehr die Kanji-Klasse und Kana-Karten wiederholen ihr Schriftsystem-Tag nicht mehr.

- [997392f71fd178e43599bc8d27be786839b98b8b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/997392f71fd178e43599bc8d27be786839b98b8b)

## Installationsumgehung durch Schema-Aktualisierung

Das japanische Inhaltsschema wurde auf Revision 46 angehoben, damit Cognis das bereinigte Schema einfügt, statt den fehlerhaften gleichversionierten Schema-Update-Befehl aus PR #226 auszuführen. Die Host-Nacharbeit ist genau dokumentiert: Der Befehl liefert `values`, obwohl das strukturierte Datenbank-Gateway `set` erwartet, wodurch unter PostgreSQL der gemeldete Fehler `Object.entries(undefined)` entsteht.

- [bb20511152a80522055af67e6895ff28e5d9b8c8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bb20511152a80522055af67e6895ff28e5d9b8c8)

## Ersetzte Lesungsdaten vollständig entfernt

Alle 48 veralteten ausgeblendeten Lesungsdatensätze wurden entfernt, anstatt getrennte Kompatibilitätsdaten zu behalten. Das Paket enthält nun nur den aktiven kanonischen Graphen und reduziert den Vokabularbestand von 133 auf 85 Datensätze, während direkte Kanji-, lexikalische und atomare Kana-Navigation erhalten bleibt.

- [b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4)

## Symmetrische Kanji- und Kana-Verwendung

Von jedem Kanji wurden nicht dargestellte Abhängigkeiten zu allen atomaren Kana seiner Lesungen ergänzt. Nach dem Pfad `日` über den lexikalischen Tageszähler `か` zum atomaren `か` führt die Kana-Karte nun `日` unter „Verwendet von“ auf; dieselbe Invariante gilt für den gesamten Kanji-Bestand.

- [0fcae71e11836dbce3361184c378e46a2ee0d430](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0fcae71e11836dbce3361184c378e46a2ee0d430)

## Logische Verknüpfungen zusammengesetzter Aussprachen

Die zeichenweisen Satztitel-Links wurden durch geprüfte lexikalische und Partikelabschnitte ersetzt. Vollständige Aussprachen verwenden nun kanonische ausgeblendete Wortlesungsabschnitte und ganze Partikeln; `ちいさいねこがすき` verknüpft beispielsweise `ちいさい`・`ねこ`・`が`・`すき`, wobei sich jedes Wort anschließend in atomare Kana auflöst.

- [973980b8e821218608836970f51a0eefc75bfb11](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/973980b8e821218608836970f51a0eefc75bfb11)

## Vom Satzelternteil bestimmte Komposition

Die parallele vollständige Kana-Satzlesungskette wurde entfernt. Ein Satz wie `猫が好き` besitzt nun nur Links zu sichtbarem `猫`, `が` und `好き`; jedes Kanji-Wort besitzt genau ein vollständiges Kana-Kind (`ねこ` oder `すき`), und diese Kinder lösen sich ausschließlich in atomare Kana auf, statt auf Satzgeschwister zu verweisen.

- [274238c377ebb0a5ce4759456a0d433df83810da](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/274238c377ebb0a5ce4759456a0d433df83810da)

## Mit Vokabeln verknüpfte Satzlesungen

Die Titeldetails eines Satzes verwenden nun dessen bestehende `words`-Beziehung, sodass vollständige Kana-Abschnitte wie `いぬ`, `やま` und `くる` auf die sichtbaren Vokabeleinträge `犬`, `山` und `来る` verweisen. Jeder Vokabeleintrag führt weiterhin nur über seine eigene vollständige Lesung zu atomaren Kana; es entsteht weder eine parallele Satzlesekette noch eine Verknüpfung zwischen Geschwisterlesungen.

- [3bc0779](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3bc0779)

## Vokabeleigene Kanji-Aussprache

Kanji-Aussprachelinks bevorzugen nun die sichtbare Vokabel, die die Lesung verwendet. Nur diese Vokabel besitzt den vollständigen Aussprache-Wrapper, der bedeutungstragende Kanji-Leseabschnitte wiederverwendet und verbleibende einzelne Kana-Suffixe direkt zu atomaren Kana führt. Beispielsweise verknüpft `好` zu `好き`, während dessen vollständige Lesung `すき` den Kanji-Abschnitt `す` und das atomare `き` verwendet, ohne eine eigenständige Aussprachekarte für `き` anzulegen.

- [b20b4e3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b20b4e3)
