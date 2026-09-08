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
