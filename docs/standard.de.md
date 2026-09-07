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

Kanji-Aussprachen und ihre Bestandteilsverweise verwenden einheitlich Hiragana-Datensätze, auch für On-Lesungen, sodass eine Definition wie `日` keine unbeteiligten Katakana-Bestandteile anzeigt. Jede vorinstallierte Lesung wird in geordnete Verweise auf ihre genauen Hiragana-Zeichen aufgelöst. Katakana-Zeichen behalten eigene IDs und Verweise und bleiben für tatsächlich in Katakana geschriebene Inhalte verfügbar.

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

Die Zeichenebene fordert Zeilen mit fünf Karten an und listet beide Schriftsysteme in der üblichen Gojūon-Reihenfolge auf. Ausdrückliche Leerzellen bewahren die Lücken in der `y`- und `w`-Zeile, während Dakuten und Handakuten als gerichtete Kinder um ihr unmarkiertes Elternzeichen angeordnet bleiben, statt doppelte Tabellenzellen zu belegen.

## Definitionsgestützte Karten und ausdrückliche Rasterlücken

An den neuesten Darstellungsvertrag der Bibliothek angepasst: Wörter, Partikeln und Sätze fordern nun lokalisierten, definitionsgestützten Kartentext an, und jeder solche Eintrag besitzt einen erforderlichen Definitionsverweis. Lücken in der Kana-Tabelle verwenden ausdrückliche Platzhalter `{ "blank": true }` anstelle veralteter Nullwerte.
