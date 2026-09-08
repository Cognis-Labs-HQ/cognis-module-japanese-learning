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

## Gerichtete Tenten-Varianten

Nur Dakuten- (Tenten-) Formen verwenden die gerichtete Eltern-Kind-Beziehung. Die mitgelieferten Datensätze `じ`/`ご` und `ジ`/`ゴ` verweisen innerhalb ihrer jeweiligen Zeichentabelle auf `し`/`こ` beziehungsweise `シ`/`コ`. Entsprechende Hiragana- und Katakana-Zeichen bleiben unabhängige Datensätze und werden nicht als Eltern und Kinder modelliert.

## Aktueller Darstellungsvertrag der Bibliothek

Gerichtete Tenten-Verknüpfungen deklarieren keine Resolver-Rolle mehr. Die Bibliothek verwendet sie daher nur zum Ausklappen von Kindkarten und dupliziert das Elternelement nicht als Bestandteilfeld. Beziehungen für Kanji-Lesungen und Wortschreibweisen behalten Resolver-Rollen für navigierbare Bestandteile. Die aktuelle Bibliothek zeigt die Aussprache von Schrifteinheiten neben Beschriftungen auf Karten und in Detailtiteln und stellt fehlende Modulinhalte bei der nächsten Aktivierung wieder her, sofern ihr Inhaltshash nicht ausdrücklich gesperrt wurde.

## Zusammensetzungen und Definitionen

Resolver-Rollen sind nun echten Zusammensetzungen vorbehalten: Kanji-Lesungen, Wortschreibweisen sowie geordneten Satzwörtern oder Partikeln. Beziehungen zur semantischen Definitionsebene deklarieren keinen Resolver mehr, sodass primäre und alternative Definitionsverweise als Bedeutungen statt als Zusammensetzungsgruppen erscheinen. Erforderliche Filter für Schriftsystem und Kenntnisstufe deklarieren außerdem gezielte Standard-Tags für den aktuellen Bibliotheksfiltervertrag.

## Vollständige Kana-Tabellen

Das Inhaltspaket enthält nun alle 46 grundlegenden Gojūon-Einträge in Hiragana und Katakana sowie sämtliche üblichen Dakuten- und Handakuten-Formen. Jedes der 25 stimmhaften oder halbstimmhaften Kinder pro Schriftsystem verweist innerhalb derselben Zeichentabelle auf sein unmarkiertes Elternelement, darunter `が` → `か`, `じ` → `し`, `ぱ` → `は` und die entsprechenden Katakana.

## Getrennte Platzierung der Diakritika

Beide Beziehungen deklarieren ausdrücklich `variant: true`, wie es bei vorhandenem `variantDirection` erforderlich ist. Dakuten-Kinder verwenden die Beziehung `dakuten-of` und werden rechts neben ihrem unmarkierten Elternzeichen aufgeklappt. Handakuten-Kinder verwenden `handakuten-of` und werden links davon aufgeklappt, sodass Elternzeichen wie `は` und `ハ` beide Varianten sichtbar behalten, statt sie an derselben Position zu überlagern.

## Standardmäßiges Kana-Raster

Die Zeichenebene fordert Zeilen mit fünf Karten an und listet beide Schriftsysteme in der üblichen Gojūon-Reihenfolge auf. Das Raster enthält nur die grundlegenden Kana-Datensätze; Dakuten und Handakuten bleiben gerichtete Kinder um ihr unmarkiertes Elternzeichen.

## Definitionsgestützte Karten

An den neuesten Darstellungsvertrag der Bibliothek angepasst: Wörter, Partikeln und Sätze fordern nun lokalisierten, definitionsgestützten Kartentext an, und jeder solche Eintrag besitzt einen erforderlichen Definitionsverweis.

## Japanischspezifische Ebenenbezeichnungen

Die erzeugten Bibliotheksregister verwenden nun fachbezogene Modulbezeichnungen: Kana für atomare Zeichen, Kanji für zusammengesetzte Schrifteinheiten und Wortschatz für Wörter. Kanji-Lesungen verweisen auf gruppierte Wortschatzdatensätze statt auf eine abgeflachte Folge von Zeichenverweisen.

## Filtersichere Kana-Reihenfolge

Unbedingte Leerplatzhalter zwischen den Hiragana- und Katakana-Folgen wurden entfernt. Wenn der Schriftsystemfilter eine Schrift ausblendet, beginnt die ausgewählte Tabelle nun in der ersten Rasterzelle, statt Leerzellen der ausgeblendeten Tabelle zu übernehmen.

## Kompakte Kana-Karten

Nur die Kana-Zeichenebene setzt `minimal: true`, sodass die Tabelle kompakte Karten mit der primären Kana-Bezeichnung darstellt. Kanji, Wortschatz und Sätze behalten ihre vollständige Darstellung von Aussprache, Definitionen, Metadaten und Zusammensetzung.

## Vollständig aufgelöste zusammengesetzte Einträge

Geordnete Zusammensetzungen entsprechen nun den neuesten Vorabprüfungen der Bibliothek. Jedes Satzzeichen wird von einem lückenlos geordneten Wort- oder Partikelverweis abgedeckt; `日本語が好き` enthält nun den zuvor fehlenden Wortschatzeintrag `好き`. Resolver-Beziehungen geben außerdem an, ob sie eine Zusammensetzung oder eine vollständige Aussprache darstellen.

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
