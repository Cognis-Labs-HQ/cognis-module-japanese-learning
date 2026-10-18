# Aktualisierungen für Japanischlernen

**Feature-Zweig:** feature-replace-library-with-new-implementation

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

- [57eb9bc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/57eb9bc1edf7d0375e8ca77bb145ef81527dedf4)

## Vokabeleigene Kanji-Aussprache

Kanji-Aussprachelinks bevorzugen nun die sichtbare Vokabel, die die Lesung verwendet. Nur diese Vokabel besitzt den vollständigen Aussprache-Wrapper, der bedeutungstragende Kanji-Leseabschnitte wiederverwendet und verbleibende einzelne Kana-Suffixe direkt zu atomaren Kana führt. Beispielsweise verknüpft `好` zu `好き`, während dessen vollständige Lesung `すき` den Kanji-Abschnitt `す` und das atomare `き` verwendet, ohne eine eigenständige Aussprachekarte für `き` anzulegen.

- [eb10612](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eb1061260347ca154c9bff6fc18c970931e4616e)

## Vollständige Links der Satzaussprache

Die Metadaten der Satzaussprache deklarieren nun sowohl Wort- als auch Partikelbeziehungen als Deep-Link-Quellen. `がっこうにいく` wird dadurch in die sichtbare Vokabel `学校`, die Partikel `に` und die sichtbare Vokabel `行く` aufgelöst, während der satzseitig besessene Graph ohne synthetischen vollständigen Leseeintrag erhalten bleibt.

- [a2ae8ba](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a2ae8ba29d2325ad624de8b798573a6429586981)

## Strichgeführte Schreibkarten

Kana- und Kanji-Karten wurden an den aktuellen Zeichenvertrag aus Cognis PR #226 angepasst und enthalten nun erforderliche normalisierte `strokePattern`-Metadaten mit geordneten Zeitwerten und Übungstoleranzen. Aus KanjiVG abgeleitete Muster bewahren die CC-BY-SA-3.0-Namensnennung; die Inhaltsdateien wurden geteilt, um die Dateigrößenbegrenzung des Repositorys einzuhalten.

- [ff5bf74](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ff5bf7464b2d8e5b58925b68f167c52b720ecba8)

## Wiederhergestellte Kana-Links der Vokabeln

Alle Ebenen mit Aussprache veröffentlichen nun das aktuelle, von Cognis PR #226 verwendete Array `input.linkRelationships`. Vokabeln wie `猫` stellen ihr Ziel `pronunciation-readings` damit über den aktuellen Vertrag bereit, sodass das angezeigte `ねこ` den erstellten Ausspracheeintrag öffnet; Kanji-Lesungen und Partikel-Kana-Links verwenden dieselbe aktuelle Metadatenform.

- [d81fda7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d81fda7fa3efaa127a5a3f21633afef600c9ea8a)

## Aussprachelinks nur nach aktuellem Vertrag

Die veralteten singulären `linkRelationship`-Metadaten wurden entfernt, statt im Beta-Inhaltsschema einen Kompatibilitätspfad beizubehalten. Aussprachefelder veröffentlichen nur noch die aktuellen, von Cognis verwendeten `linkRelationships`-Arrays; Regressionstests verhindern die erneute Einführung der Legacy-Eigenschaft.

- [9376566](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/937656620115c72eeea3f7f8273a8aff3a30c160)

## Laufzeit-Anbieter für Strichmuster

Der aktuelle Lookup-Anbieter-Vertrag der Cognis Library wurde für japanische Schreibzeichen implementiert. Exakt übereinstimmende Kana- und Kanji-Bezeichnungen liefern ihr paketiertes, validiertes `stroke_pattern` mit stabiler KanjiVG-Herkunft und Konfidenz `1`; unbekannte Bezeichnungen werden nicht erraten. Der Anbieter arbeitet vollständig lokal – ohne Netzwerkdienst oder OCR – und seine Registrierung wird beim Deaktivieren oder unmittelbar nach fehlgeschlagener Übernahme entfernt.

- [9c6ba69](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9c6ba6910450efd81f08e7982c67d69fe89ab0f6)

## Vollständige Strichmustersuche für Kana und Kanji

Der Suchanbieter wurde über den mitgelieferten Lehrplan hinaus erweitert. Mitgelieferte Muster bleiben sofort und offline verfügbar; jedes andere japanische Kana oder Kanji wird über seinen Unicode-Codepunkt anhand der kanonischen KanjiVG-SVG-Daten aufgelöst, in begrenzte normalisierte Strichproben umgewandelt, zwischengespeichert und mit genauer Herkunft sowie Konfidenz `1` zurückgegeben. Nicht unterstützte oder nicht verfügbare Zeichen liefern keine Vermutung; für exakte Texteingaben ist OCR bewusst nicht erforderlich.

- [326145f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/326145f3eb05ed9d4df521f92728067d87f19d9d)

## Native Jisho-Kartensuche mit Vorrang

Ein lokalisierter Jisho-Composer-Anbieter für Kana-, Kanji- und Vokabelkarten wurde nach dem neuesten Cognis-Suchvertrag hinzugefügt. Exakte mitgelieferte Einträge liefern alle geprüften Felder und Beziehungen ohne Netzwerkanfrage. Bei einem nativen Fehltreffer wird vor der Jisho-Abfrage ein begrenzter Anfragecache verwendet; anschließend werden kanonische Bezeichnungen, Aussprachen, JLPT-Stufen und ausschließlich bereits im Anbietergraphen vorhandene Kanji-, Lese-, Kana- oder Definitionsverknüpfungen befüllt. Der Strichmusteranbieter veröffentlicht nun ebenfalls die vom aktuellen Composer benötigten lokalisierten Metadaten.

- [7e6ef74](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7e6ef7480eabb9fb4724bb51532523cfd32f89fd)

## Registrierung über den generischen Library-Anbieter

Jisho stellt nun einen eigenen Registrierungsadapter bereit, der die generische Fähigkeit `study:library:provider` entgegennimmt und direkt an `registerLookupProvider` delegiert. Bootstrap verwendet diesen Adapter, bewahrt die zurückgegebene Entfernen-Funktion auf und entfernt bereits registrierte Anbieter in umgekehrter Reihenfolge, falls eine spätere Registrierung oder das Einlesen von Inhalten fehlschlägt. Die Integration hängt nicht mehr von einer Jisho-spezifischen Host-Fähigkeit ab.

- [bfea956](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bfea956d632cc40a088b4296d2d02eb2535ef79b)

## Paketierter Registrierungs-Einstiegspunkt

Der Manifest-Digest für den generischen Jisho-Registrierungs-Einstiegspunkt und seine Regressionstests wurde aktualisiert.

- [bfea956](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bfea956d632cc40a088b4296d2d02eb2535ef79b)

## Eigenständige Strichmuster-Laufzeit

Die nicht bereitgestellte Produktionsabhängigkeit `svg-path-properties`, die Cognis beim Aktivieren am Import des Moduls hinderte, wurde entfernt. Das Modul liefert nun einen eigenen begrenzten SVG-Pfad-Tokenizer, Kurven-Sampler und distanzbasierten Resampler für KanjiVG-Striche mit. Regressionstests führen Bootstrap-, Strichmuster- und Deinstallationstests aus einem kopierten Modulbaum ohne `node_modules` aus und entsprechen damit der Installationsumgebung externer Module.

- [4af0efc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4af0efc58f962bcf07a087d0066ce2d7b54bf253)

## Auflösung der inversen Library-Fähigkeit

Bootstrap bezieht die erforderliche Library-Registrierungsoberfläche nun über `ctx.capabilities.require("study:library:provider")` und folgt damit dem inversen Anbietermuster der SSO-Authentifizierungsmodule. Der Komfort-Getter, der für diese erforderliche Fähigkeit `undefined` zurückgab, wird nicht mehr verwendet; Formprüfung und Lebenszyklusbereinigung der Anbieter bleiben erhalten.

- [c1c8a23](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c1c8a2304c9550d158842311194e3a5ec5e6db99)

## Sichtbarkeitsbrücke für den Library-Anbieter

Bootstrap bevorzugt nun die injizierte öffentliche Fähigkeit `study:library:provider`. Wenn Cognis PR #226 sie jedoch nur für die Aktivierungsprüfung bereitstellt, verwendet Bootstrap den injizierten Dienst `study:library` als Träger derselben generischen Schnittstelle aus `registerLookupProvider` und `ingestContentPack`. Dadurch funktioniert die Aktivierung ohne ein zweites Anbieterprotokoll; Tests decken beide Sichtbarkeitsformen des Hosts ab.

- [a9d1c15](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a9d1c155470fca1b8bc65bcdb6d7bced1a03d828)

## Vollständig auflösbare Satz- und Kanji-Links

Die Titeldetail-Links wurden mit dem exakten Alias-Kompositionsalgorithmus des Hosts geprüft. Für jede Satzaussprache ist nun nachgewiesen, dass ihre geordneten Kana-Abschnitte die vorgesehenen Vokabel- und Partikeleinträge öffnen. Jedes Kanji stellt eine vollständige Primärlesung bereit, die zu genau einem angrenzenden Vokabelziel passt; weitere Lesungen verwenden eine separate Nicht-Titel-Beziehung und behalten alle atomaren Kana-Abhängigkeiten für die inverse Navigation.

- [9d7abe8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9d7abe8203769376d0249bda7b790ac84b4266cf)

## Ausrichtung am Vertrag für paketierte Audiodateien

Externe Platzhalter-Audio-URLs wurden entfernt, da der aktuelle Inhalts­paket-Validator der Library sie korrekt als `invalid_asset_reference` zurückweist. Die Aussprache von Schrifteinheiten bleibt erforderlich; Audio ist nun ein optionales Uploadfeld, bis eine authentische Audiodatei im Paket mitgeliefert wird.

- [ac71f82](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ac71f82fa6bfd798e9ea05be7c882e523a8f7da5)

## Direkte Kana-Verwendungsbeziehungen

Die künstliche Abhängigkeitsbeziehung von Kanji zu Kana wurde entfernt. Kana-Karten zeigen unter „Verwendet von“ nur noch unmittelbare Lesungsdatensätze und bewahren damit die vorgesehene Navigation `あ` → `あめ` → `雨`, statt nicht verwandte Wörter und Kanji als direkte Eltern darzustellen.

- [98c2e49](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/98c2e4954513cd03eb4f8a76b1e57b011a3daca5)

## Aussprachegrenzen nur für Kanji

Kanji-Aussprachelinks verweisen jetzt auf eigene reine Kana-Lesungsdatensätze statt auf vollständige sichtbare Wörter. `好` zeigt und verknüpft daher `す`, während der getrennte Aussprache-Wrapper von `好き` das `す` mit dem Suffix `き` zusammensetzt; eigenständige Kanji-Wörter verwenden dieselbe zweistufige Grenze ohne gleich bezeichnete Eltern.

- [0900421](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/090042170e97a4f9d76d0433e2057e360ee973f9)

## Kurventreue Kana-Strichmuster

Alle paketierten Kana- und Kanji-Strichmuster wurden aus festgelegten, nach Unicode benannten KanjiVG-SVG-Pfaden neu erzeugt. Der moduleigene Sampler unterteilt kubische und quadratische Kurven vor der Abstandsabtastung und bewahrt dadurch Wendungen und Schleifen wie im zweiten Strich von `え`, statt sie auf irreführende gerade Segmente zu reduzieren.

- [76cf76e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/76cf76e300dbc6e2443d10710bd5e33c160c815e)
- [76cf76e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/76cf76e300dbc6e2443d10710bd5e33c160c815e)

## Rekursiv aus Kana abgeleitete Aussprache

Alle 84 ausgeblendeten, nur aus Zeichen bestehenden Wortschatz-Aussprache-Wrapper wurden entfernt. Atomare Kana sind nun die einzigen Aussprache-Endpunkte: Kanji und die 37 echten Wortschatzkarten verweisen direkt auf geordnete Kana, während Sätze nur echten Wortschatz und Partikeln referenzieren. Die Aussprachewerte von Wortschatz und Sätzen werden für die Anzeige aus diesem Graphen materialisiert und als Aussprachebeziehungen gekennzeichnet, sodass der geschriebene Satz nicht mehr unter seinem Titel wiederholt wird.

- [b2a396a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2a396aaafe01405abb35efb4418202f3bc46cff)

## Validierung geordneter Sätze

Die Satzbeziehungen wurden an die aktuelle Ingestions-Vorprüfung aus Cognis PR #226 angepasst. Geordnete `words` und `particles` sind wieder Kompositionsbeziehungen, sodass der Host jede Satzbezeichnung rekonstruieren und validieren kann, während die Aussprache weiterhin rekursiv aus diesen Bestandteilen abgeleitet wird.

- [fec3fb5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fec3fb5b593194ec64c1e2ad32032e7567debf4d)

## Sichtbare Kana-Aussprache

Die romanisierte Aussprache auf kompakten Kana-Karten wurde wiederhergestellt, ohne die rekursiven japanischen Lesungen zu beeinträchtigen. Jedes Kana behält seine ursprüngliche Form zuerst für die Ausspracheableitung und stellt seine Hepburn-Umschrift als eigenen Anzeigewert bereit, den der aktuelle Library-Renderer beibehält.

- [29b678e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/29b678eac314782f4dc693bbd3855a1ae3c61184)

## Verständliche Kana-Laute

Die Kana-Aussprache enthält jetzt ausschließlich die Hepburn-Umschrift. Lernende sehen nun `a` als Aussprache von `あ` oder `ア` und niemals dasselbe Zeichen als seine eigene Aussprache; japanische Schreibweisen höherer Ebenen verwenden weiterhin geordnete Kana-Bezeichnungen.

- [93532bd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/93532bd4c8ed8c3e653b34332df1623f23f784c9)

## Gruppierte Kana-Ausspracheverweise

Alternative Kanji-Lesungen wurden wiederhergestellt, und jede Aussprache von Kanji und Wortschatz wird als eigene verschachtelte Folge geordneter Kana-Verweise dargestellt. Das Schema markiert diese Felder als `multi_value` und ihre Beziehungen als gruppiert; auch Jisho-Vorschläge bewahren dieselbe Struktur für die kommende Unterstützung im Cognis-Kern.

- [ea6c997](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ea6c99745df322094aaa4ba26b1b7e6e8de9558a)

## Ausgeblendete Wortschatz-Aussprachebrücken

Ausgeblendete Aussprachedatensätze wurden nur dort wiederhergestellt, wo die Wortschatzbedeutung von den Definitionen der geschriebenen Kanji abweicht. Jede Brücke trägt die lexikalische Definition, verknüpft die betreffende Kanji-Schreibweise und löst über gruppierte Kana-Verweise auf; Wörter mit gleicher Definition behalten ihren direkten Kana-Pfad, und Lookup-Vorschläge schließen die ausgeblendeten Datensätze aus.

- [da85016](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/da8501693bbc2e105df9e95cd0333559c79dc46b)

## Vollständige Verknüpfungen für Kanji-Aussprachen

Jede Kanji-Aussprache verweist nun über einen eigenen ausgeblendeten Datensatz für die vollständige Lesung auf geordnete atomare Kana. Alle sechs Lesungen von `来` (`く`, `きた`, `き`, `こ`, `らい` und `たい`) besitzen jetzt funktionierende Tiefenverknüpfungen; dieselbe Invariante wird für jedes enthaltene Kanji geprüft.

- [286d3ee](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/286d3ee07376843bc4f5992ea00cf1e7db01e05f)

## Vollständige Aussprachepfade für Wörter und Sätze

Alle mit Kanji geschriebenen Wörter sind nun mit ihren enthaltenen Schriftzeichen und einem ausgeblendeten Datensatz für die vollständige Aussprache verbunden. Dabei bleiben vorhandene Kanji-Lesesegmente vor den atomaren Kana erhalten. Satzaussprachen durchlaufen vollständige ausgeblendete Datensätze aus Wortlesungen und Partikel-Kana. Jisho-Vorschläge prüfen außerdem die Schrift je Ebene, behalten verfügbare Kanji-Schreibverknüpfungen bei und lassen unvollständige Kana-Gruppen weg.

- [4e549a9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4e549a90346e73f19bed8e21edd6ae78f95d5074)

## Gemeinsame Aussprachekarten für Homophone

Die doppelten ausgeblendeten Aussprachekarten für `はな`, `はし`, `あめ` und `かみ` wurden durch jeweils eine gemeinsame Karte pro vollständiger Kana-Lesung ersetzt. Jede gemeinsame Karte fasst die zugehörigen lexikalischen Definitionen zusammen und wird von den unterschiedlichen sichtbaren Kanji-Wörtern verwendet. Dadurch verlinken gleich beschriftete Karten nicht mehr aufeinander, während jedes Homophon als eigenes Lernwort erhalten bleibt.

- [abd8c3b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/abd8c3b545fe155d4c7c2439cadb337707c408c2)

## Stabile Navigation zwischen Leseebenen

Erfasste Beziehungen sind jetzt die einzige Quelle der Navigation zwischen Lesekarten. Lesepfade von Vokabeln können nicht mehr auf eine gleich beschriftete Vokabelkarte zeigen: Vollständige Aussprachen einzelner Kanji lösen sich direkt in geordnete Kana auf, während Zusammensetzungen nur echt kleinere Lesesegmente behalten. Ausgeblendete strukturelle Lesungen kopieren keine semantischen Definitionen mehr. Sichtbare Vokabeln behalten eine lokalisierte Definition nur, wenn ihre Bedeutung vom Kanji abweicht; identische Bedeutungen werden über den übergeordneten Schreibweiseeintrag übernommen, und Definitionen, die mit der Hauptbeschriftung identisch sind, bleiben in Cognis ausgeblendet.

- [5bed22f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5bed22f956d41cdbbbf97749acae0400dbe01275)

## Geprüfte Kanji-Lesungen und Anfängerinhalt

Die Ausspracheabdeckung ist jetzt auf den geprüften KANJIDIC-Bestand an On- und Kun-Lesungen festgelegt, einschließlich deterministischer Normalisierung, eines ausgeblendeten Lesedatensatzes pro Ergebnis und einer ausdrücklichen kontextbedingten Ausnahme für `達` als `だち`. Ergänzt wurden lokalisierte Definitionen für lexikalisch abweichende Karten sowie ein geprüfter Stapel aus neun Wörtern zu Ort, Existenz, Beschreibung, Art und Weise und Kopula mit acht natürlichen Beispielsätzen und vollständigen Aussprachepfaden.

- [ddfb838](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddfb83889f2172985b1b8290e0737832f9187ac8)

## Zuständigkeit für die Löschfläche der Bühne

Es wurde bestätigt, dass das Entfernen bereitgestellter Karten im Cognis Study-Library-Composer implementiert und gestaltet wird und nicht in diesem externen Japanisch-Inhaltsmodul. Die genauen Host-Selektoren, die erforderliche Größenkorrektur und der Browser-Regressionstest sind in `TODO.md` festgehalten; das Modul schleust keine unsichere CSS-Überschreibung in einen vom Host verwalteten Editor ein.

- [8e9f064](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8e9f0646527535a2ef05cfd53a96b3f7438e28bd)

## Romanisierungsauflösung nur für Kana

Es wurde bestätigt, dass das Japanisch-Paket die Hepburn-Umschrift bereits auf atomare Kana beschränkt, während Lesungen höherer Ebenen als japanische Kana-Bezeichnungen verfasst sind. Die genaue erforderliche Korrektur am Cognis-Composer wurde festgehalten, damit die rekursive Ausspracheableitung die Kana-Umschrift nicht in Wortschatz- und Satzlesungen übernimmt; das externe Modul überschreibt kein hosteigenes Ableitungsverhalten.

- [35975db](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/35975dbcb8e4de5c6da0721e67adf96070d9ae9f)

## Ausdrückliche destruktive Deinstallationsbereinigung

Der von Cognis erwartete administrative Endpunkt zum Löschen der Modulkonfiguration wurde als inhaltssichere `204`-Kompatibilitätsroute ergänzt. Paketierte Japanisch-Datensätze werden jetzt nur dann über den Study-Library-Provider gelöscht, wenn die Deinstallationsanfrage ausdrücklich `deleteContent: true` enthält; Deaktivierung, gewöhnliche Deinstallation, fehlende Bereinigungsunterstützung und Bereinigungsfehler können etablierte Lerndaten weder unbemerkt löschen noch verwaisen lassen.

- [5c36f40](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5c36f401cf0066600d44e0863ce86cb58da5c58f)

## Wiederhergestellte Definitionen auf Wortschatzkarten

Allen sichtbaren, mit Kanji geschriebenen Wortschatzeinträgen, die zuvor von ihrem Schreibungs-Elterneintrag abhingen, wurden direkte Definitionsbeziehungen hinzugefügt. Dies entspricht dem Cognis-Karten-Renderer, der nur direkt referenzierte Definitionen anzeigt, und stellt die Bedeutungen unter anderem für `川`, `空`, `花`, `鼻`, `橋`, `箸`, `雨`, `飴`, `水`, `犬`, `猫`, `山`, `紙` und `髪` wieder her.

- [7dd6179](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7dd61791b5af32e0fe27f5db9a9298f2b4fc9a74)

## Funktionierende Jisho-Wortschatzsuche

Der Ablauf des Jisho-Composers wurde korrigiert, sodass die Wortschatzsuche begrenzte englische und andere lateinische Suchbegriffe akzeptiert, statt ohne Anfrage sofort kein Ergebnis zu melden. Exakte paketierte japanische Einträge bleiben vorrangig lokal; japanische Remote-Anfragen bevorzugen exakte Formen, während Bedeutungssuchen Jishos höchstbewertetes Ergebnis verwenden. Kana- und Kanji-Ebenen erfordern weiterhin ein gültiges japanisches Zeichen, und unsichere oder überlange Eingaben werden vor dem Netzwerkzugriff abgelehnt.

- [3ae4cbe](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3ae4cbe0874933fa718765636bfe69279367db63)

## Transformationsansichten für Grundformen von Verben und Adverbien

Das Japanisch-Paket wurde an den neuesten Cognis-Transformationsvertrag angepasst. Der Wortschatz trennt nun Grundformen von Verben und unveränderliche Adverbien in eigene Ansichten; Verben unterscheiden Ichidan, reguläre Godan-Endungen, die Ausnahmen `行く` und `ある` sowie das unregelmäßige `来る`. Vom Provider deklarierte Regeln leiten geprüfte Höflichkeits-, Verneinungs-, Vergangenheits- und Te-Formen zur Anzeigezeit ab, während das Paket nur die zwölf kanonischen Grunddatensätze für Verben und Adverbien und keine erzeugten Duplikate speichert.

- [1c251e5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1c251e56e591b36b4aefd8144ce6213075d3b30f)

## Segmentierte Links in Satzaussprachen

Aussprachedetails von Sätzen verknüpfen jetzt jedes geordnete Lesungssegment direkt mit seiner sichtbaren Wortschatz- oder Partikelkarte. Die 25 ausgeblendeten Wortschatz-Wrapper für vollständige Sätze und die Satzbeziehung `pronunciation-readings` wurden entfernt, sodass `はなはとてもきれいです` die Einträge `花`, `は`, `とても`, `きれい` und `です` einzeln öffnet, statt eine einzige Wortschatzkarte für den vollständigen Satz darzustellen.

- [03377a7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/03377a7816980bf5230ee83739b70af4dad33182)

## Schutz für vollständige japanische Aussprache

Alle paketierten Aussprachen höherer Ebenen wurden geprüft und auf vollständigen japanischen Text festgelegt, einschließlich der vollständigen Satzrekonstruktion. Die gemeldete gemischte Umschrift und das fehlende letzte Segment entstehen in Cognis PR #226: Die rekursive Ableitung liest das Hepburn-Feld der Kana-Karte vor ihrer atomaren Beschriftung, und das Host-Popup muss die vollständige gruppierte Lesespanne erhalten. Der genaue vorgelagerte Basisfall und die Umbruchregression wurden festgehalten, ohne unsichere Überschreibungen der Host-Oberfläche in dieses externe Paket einzubauen.

- [cd764a7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cd764a7611976f5b58152b97ebadb073cc96ce1b)

## Lesungstitel-Navigation zu atomaren Kana

Allen ausgeblendeten Kanji-Lesungsdatensätzen wurden ausdrückliche geordnete Titelzusammensetzungen aus atomaren Kana hinzugefügt. Eine mehrteilige Kana-Lesung wie `さん` öffnet nun direkt `さ` und `ん`, sodass der Host nicht mehr die separate ausgeblendete Kanji-Lesungs-Wortschatzkarte `さ` von `小` einsetzen kann. Die vollständigen `kana-spelling`-Beziehungen bleiben für die Aussprachebedeutung erhalten, während die Titelnavigation deterministisch bei Kana endet.

- [612e4cb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/612e4cb4df57a5afb62cd4dcf4291c7516d2e91e)

## Navigation für zusammengesetzte Kana und Geometrie kleiner Formen

Allen Kana-Karten mit mehreren Zeichen wurde eine ausdrückliche Titelzusammensetzung aus atomaren Kana hinzugefügt. Dadurch verweisen zusammengesetzte Kana wie `きょ` nicht mehr auf ausgeblendete Wortschatzlesungen mit demselben Text. Die Strichlayouts wurden mit größenabhängigen Bereichen neu aufgebaut, sodass kleine Formen wie `ょ` neben Kana normaler Größe ihre sichtbar verkleinerten Proportionen behalten.

- [305e774](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/305e7743a0ab48ca335cac9add23cb1c670def20)

## Satzverknüpfungen ohne vorgetäuschte Satzvokabeln

Die Ausspracheverknüpfungen eines Satzes zu seinen geordneten sichtbaren Vokabel- und Partikelbestandteilen wurden wiederhergestellt. Verstärkte strukturelle Regressionstests weisen vollständige Satzlesungen, Satzkomposite, Partikelklassen, Partikelverweise und ausgeblendete Satzbestandteile aus dem Vokabellayer zurück, ohne legitime Satzverknüpfungen zu entfernen.

- [ad97003](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ad97003b391165fcd5411e708bf771fdac729d13)

## Direkte Kanji-Lesungen ohne Kana-duplizierende Vokabeln

Alle 140 ausgeblendeten `reading:kanji`-Vokabeldatensätze wurden entfernt, einschließlich einzelner Kana-Ausreißer wie `む`. Kanji-Aussprachegruppen und entfernte Jisho-Kanji-Vorschläge verknüpfen nun direkt geordnete atomare Kana; vollständige lexikalische Aussprachehüllen bleiben nur erhalten, wenn sie keine Kana-Schreibeinheit duplizieren.

- [bbfe7ae](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bbfe7aed644efc97e0d619b5ccc2d684c12880d2)

## Tief verzweigte Verbtransformationen

Das japanische Paket wurde an Cognis' Vertrag für zusammensetzbare Transformationsbäume angepasst. Alle Verbfamilien verzweigen nun in höfliche, verneinte, vergangene, verbindende, kausative, passive, potenzielle und volitionale Pfade, einschließlich einer vierstufigen Kausativ-Wunschkette. Schriftform und Aussprache werden unabhängig transformiert, lokalisierte Definitionsüberschreibungen erläutern semantische Zweige, Adverbien bleiben unveränderte Grundkarten und erzeugte Formen bleiben reine Darstellung.

- [6d3e6bf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6d3e6bf546acdcccd860b4c9a7ac75649c1a5dff)

## Selektive Zwischenkarten für Kanji-Lesungen

Nur für Kanji mit mehreren Lesungen wurde je Aussprache eine ausgeblendete Lesungs-Vokabelkarte wiederhergestellt; das einzige Kanji mit nur einer Lesung führt weiterhin direkt zu atomaren Kana. Jede Zwischenkarte verknüpft ihren Titel mit genau einem Quell-Kanji, rekonstruiert ihre Aussprache aus atomaren Kana und darf bei engerer Bedeutung eine eigene Definition besitzen. Vollständige Kana-Worthüllen wie `せんせい` wurden entfernt; `先生` setzt seine Lesung nun aus den getrennten Zwischenkarten `せん` und `せい` zusammen.

- [0f16eda](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0f16edaecc01c74449dcd9a28ebccca898f5ffd5)

## Eigenständige Definitionen für Lesungen

Allen ausgeblendeten Kanji-Lesungs-Vokabeldatensätzen wurden direkte Definitionsverknüpfungen hinzugefügt. Dadurch zeigt das Öffnen einer Lesung über einen Aussprache-Deep-Link dieselbe Bedeutung wie das Öffnen über den Bereich „Verwendet von“ der Kanji-Karte. Bei identischer Bedeutung werden die Definitionen des Quell-Kanji wiederverwendet; engere Lesungsbedeutungen können weiterhin eigene Definitionen besitzen.

- [935f6c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/935f6c9d0ee0ff5cb3b0284a839a76d74221e30b)

## Lokalisierte Transformationsmarker

Kausativ-Wunsch-Zweige veröffentlichen nun lokalisierte `marker`-Metadaten auf Deutsch, Englisch, Indonesisch und Japanisch. Cognis kann diese Ausdrücke in Definitionsvorlagen einsetzen und weiterhin ausdrücklich transformationsspezifische Definitionen bevorzugen.

## Variantenwahl innerhalb des Wortschatzes

Der dokumentierte Vertrag belässt kanonische Verben und Adverbien in der Wortschatzebene und zeigt ihre tiefen Transformationsbäume über die Variantenwahl des Hosts, ohne erzeugte Formen als Lerneinträge zu speichern.

## Versionsabgleich

Das Modul wird auf `2.2.72`, die Inhaltsrevision auf `2026-09-30.10` und das japanische Schema auf Revision `77` angehoben; die Pakethashes wurden neu erzeugt.

## Definitionsanmerkungen für jede Transformation

Jede bereitgestellte Verbtransformation besitzt nun lokalisierte Marker-Metadaten. Direkte Wunschzweige erzeugen Formen wie `見たい`; Verneinung, Vergangenheit, Höflichkeit, Verbindung, Passiv, Potential, Volitional, Kausativ und tiefere Zweige liefern jeweils eine eigene Bedeutungsanmerkung.

## Unabhängige mehrdeutige Definitionen

`見る` verweist nun getrennt auf die Definitionen „sehen“ und „anschauen“. Regressionstests wenden den Wunschmarker unabhängig auf jede Definition an; jede lokalisierte Verbdefinition enthält nun den erforderlichen `{{ marker }}`-Platzhalter.

## Strukturierte Cognis-Nacharbeit

Das Paket folgt dem Cognis-Markervertrag direkt, indem jede lokalisierte Verbdefinition genau einen `{{ marker }}`-Platzhalter enthält und getrennte Definitionsdatensätze bei der Transformationsdarstellung erhalten bleiben.

## Marker-Platzhalter in Verbdefinitionen ergänzt

Jede lokalisierte Definition, auf die ein Verb verweist, enthält nun genau einen `{{ marker }}`-Platzhalter an der grammatisch passenden Einfügestelle. Cognis kann dadurch die beiden Definitionen von `見る` ohne Raten in `to (want to) see` und `to (want to) watch` umwandeln.

## Mehrdeutige Definitionen bleiben getrennt

Die kombinierte Bedeutung von `学ぶ` wurde in getrennte Definitionsdatensätze für „lernen“ und „studieren“ aufgeteilt, entsprechend der vorhandenen Aufteilung für `見る`. Tests verlangen für jede sichtbare Verbdefinition und jede Sprache genau einen Marker-Platzhalter.

## Versionsabgleich

Das Modul wird auf `2.2.74`, die Inhaltsrevision auf `2026-10-01.2` und das japanische Schema auf Revision `79` angehoben; die Pakethashes wurden neu erzeugt.

## Zusammensetzbare Definitionstransformationen

Feste `marker`-Metadaten und gespeicherte `{{ marker }}`-Platzhalter wurden durch die Cognis-2.24-Struktur `definitionTransform` ersetzt. Jede Regel deklariert nun lokalisierte entfernbare Grenzen und Vorlagen mit `{{ definition }}`, `{{ stem }}`, `{{ prefix }}` und `{{ suffix }}`; die Vorlagen werden entlang tiefer Transformationspfade der Reihe nach zusammengesetzt.

## Saubere Definitionen und Tests tiefer Pfade

Verbdefinitionen sind wieder normaler lokalisierter Text; einheitliche Infinitivgrenzen ermöglichen es den Vorlagen, jede mehrdeutige Definition unabhängig zu transformieren. Tests decken die Wunschform von `見る` und einen vierstufigen Kausativ-Wunsch-Pfad ab, ohne Bedeutungen zusammenzufassen.

## Versionsabgleich

Das Modul wird auf `2.2.75`, die Inhaltsrevision auf `2026-10-01.3` und das japanische Schema auf Revision `80` angehoben; die Pakethashes wurden neu erzeugt.

## Kontextabhängige Definitionsersetzungen

Definitionstransformationen verwenden nun die geordneten lokalisierten `replacements` aus Cognis 2.24.1 vor den Ausweichvorlagen. Vergangenheits- und Verneinungszweige können frühere Wunsch-, Kausativ-, Höflichkeits- und Bedingungsbedeutungen umschreiben; Verbindungszweige hängen ihre Bedeutung mit `{{ definition }}` an die vollständig transformierte Definition an.

## Tests für kontextabhängige Ketten

Tests prüfen die Umschreibung von `to (want to) see` zu `to (have wanted to) see`, die verbindende Wunschform `to (want to) see (and then)` und die vollständige Bedeutung des tiefsten Kausativ-Wunsch-Pfads.

## Versionsabgleich

Das Modul wird auf `2.2.76`, die Inhaltsrevision auf `2026-10-01.4` und das japanische Schema auf Revision `81` angehoben; die Pakethashes wurden neu erzeugt.

## Seitenverhältnisgerechte Zeichenmuster

Jedes paketierte Strichmuster deklariert nun seine logische Spaltenzahl. Die Cognis-Zeichenübung kann Einzel- und Mehrzeichenmuster in den seitenverhältnistreuen Darstellungsbereich einpassen, statt die Zeichenfläche zu verzerren oder Zeichen auf falsch bemessene Zellen zu verteilen.

## Zeichenbezogene Strichprüfung

Strichmuster veröffentlichen nun geordnete Gruppenlängen pro Zeichen; auch entfernte Mehrzeichenmuster bewahren dieselben Metadaten. Dadurch behalten Hinweise zum nächsten Strich und Tests mit ausgeblendeten Hilfen die Zeichengrenzen bei. Eine Host-Nacharbeit hält fest, dass Verbundmuster erstellte Gruppen bewahren und Wortschatzzusammensetzungen optische, begrenzungsabhängige Abstände verwenden müssen.

## Versionsabgleich

Das Modul wird auf `2.2.77`, die Inhaltsrevision auf `2026-10-01.5` und das japanische Schema auf Revision `82` angehoben; die Pakethashes wurden neu erzeugt.

## Zeichenbasierte Kanji-Identität

Die Kanji-Suche normalisiert und vergleicht jetzt direkt das eingegebene Zeichen, statt eine gemeinsame Aussprache als Identität zuzulassen. Regressionstests belegen, dass `券` von vorhandenen Kanji wie `犬` getrennt bleibt, obwohl beide `けん` verwenden können; echte Konflikte desselben Zeichens lassen sich über den von Cognis Library 2.24.3 gelieferten Konflikteintrag auflösen.

## Versionsabgleich

Das Modul wird auf `2.2.78` und die Inhaltsrevision auf `2026-10-01.6` angehoben; die Pakethashes wurden neu erzeugt.

## Satzstruktur-Komposition

Der japanische Satzkonstruktor folgt nun Cognis Library 2.24.9 mit getrennten Wort- und Partikeleingaben, einem anbietereigenen Karussell für Satzstrukturen und wiederverwendbaren japanischen Satzzeichen. Die sichtbare Kopula `です` trägt das Tag `sentence-structure`; sie bleibt bedeutungsvoller Wortschatz und kann beim Erstellen von Sätzen direkt ausgewählt, angeordnet, entfernt und wiederhergestellt werden.

## Versionsabgleich

Das Modul wird auf `2.2.79`, die Inhaltsrevision auf `2026-10-02.1` und das japanische Schema auf Revision `83` angehoben; die Pakethashes wurden neu erzeugt.

## Erweiterte Satzkonnektoren

Das Satzstruktur-Karussell enthält nun `それでも`, `ですが`, `だけど`, `しかし`, `そして`, `それから`, `だから`, `なので` und das einfache `だ`. Jede neue sichtbare lexikalische Karte besitzt eine lokalisierte Bedeutung, einen exakten Lesepfad über atomare Kana, eine passende Kompetenzstufe und einen geprüften verfassten Satz.

## Transformationsbaum für Kopulas

Der Wortschatz veröffentlicht nun eine eigene Transformationsansicht für Kopulas. Die einzige gespeicherte einfache Grundform `だ` leitet `だった`, `ではない`, `ではなかった` und die Verbindungsform `で` ab; das höfliche `です` bleibt ein eigenständig verfasstes Satzstrukturwort und keine duplizierte erzeugte Karte.

## Versionsabgleich

Das Modul wird auf `2.2.80`, die Inhaltsrevision auf `2026-10-02.2` und das japanische Schema auf Revision `84` angehoben; die Pakethashes wurden neu erzeugt.

## Gültige Metadaten für Kopula-Transformationen

Kopula-Regeln lassen nun ungenutzte optionale Definitionsgrenzen weg, statt leere lokalisierte Bezeichnungen zu veröffentlichen. Die lokalisierten Vorlagen bleiben erhalten, sodass die strenge Study-Library-Validierung das Paket erfolgreich aktivieren und einlesen kann. Das Modul wird auf `2.2.81`, die Inhaltsrevision auf `2026-10-02.3` und die Schemarevision auf `85` angehoben.

## Anklickbare Aussprache im Wortschatz

Aussprachefelder im Wortschatz verwenden nun den singulären Host-Vertrag `pronunciation-readings`. Jede sichtbare Wortschatzkarte verlinkt auf einen verborgenen vollständigen Aussprachedatensatz, der den geordneten Pfad über Kanji-Lesungen und atomare Kana bewahrt; dadurch kann beispielsweise `ちいさい` von der Karte `小さい` aus geöffnet werden. Das Modul wird auf `2.2.82`, die Inhaltsrevision auf `2026-10-04.1` und die Schemarevision auf `86` angehoben.

## Auswahl gleicher Zusammensetzung

Modulversion 2.2.97 behält Inhaltspaketversion 2.2.93 und Schemarevision 88 bei. Cognis bündelt Wörterbuchtreffer gleicher Schreibzusammensetzung als alternative Lesungen und Bedeutungen. Eine andere Schreibweise wird beim Anklicken sofort übernommen und ihre benötigten Kanji werden aufgelöst oder erstellt. Weiter oder Schließen behält die genaue Zusammensetzung und verwirft erweiterte Treffer. Lesekarten behalten ihren Pfad zu einzelnen Kana. Auswahl, Kartenerstellung, Sichtbarkeitsprüfung, Zwischenspeicherung und Benachrichtigungen bleiben Aufgaben des Hosts.

## Vorbereitete Ausspracheaufnahmen ausliefern

Gesprochene Seed-Karten enthalten deduplizierte, offline erzeugte MP3-Dateien und Stimmnachweise. Sätze behalten die geordnete Wiedergabe ihrer Bestandteile.

## Bereichsgebundenen Audioabruf registrieren

Beide Study-Module verwenden denselben entfernbaren Audioanbieter-Vertrag und rufen mitgelieferte Aufnahmen durch begrenzte lokale Dateizugriffe ab. Autorisierung, Cache-Richtlinien und zusammengesetzte Wiedergabe gehören dem Host.

## Paketziele und Entwicklerhinweise

Ausgabe 2.2.107 — Die Paketprüfung stellt sicher, dass Einstiegspunkte, Icons, Banner und Screenshots reguläre Dateien innerhalb des Checkouts sind, auch nach Pfadauflösung. Die Dokumentation beschreibt öffentliche Verträge und verweist für Veröffentlichungsmetadaten auf Manifeste; Änderungsprotokolle behalten die Herkunft der Veröffentlichung.

## JLPT-Stufen frei auswählen

Der JLPT-Filter beginnt jetzt ohne ausgewählte Stufe und erlaubt wie der optionale Verbtypfilter mehrere Auswahlen. Ohne ausgewählte Stufe werden alle Vokabelkarten angezeigt, einschließlich Karten ohne JLPT-Stufe.

## Paketrevision

Schemarevision 87 und Modul-/Inhaltspaketversion 2.2.83 veröffentlichen die geänderte Auswahlregel über den bestehenden Study-Library-Vertrag.

## Vollständige Jisho-Ergebnisse

Der Jisho-Anbieter liefert alle Aussprachen mit geordneten Kana-Gruppen, eine importierbare Definition je Bedeutung, lexikalische Klassifikation, JLPT-/Häufigkeitstags und die Quell-URL. Über die Registrierung bei `study:library:provider` deklariert er die Wörterbuchfähigkeit. Vollständige Quelldatensätze einschließlich Schreibvarianten, Wortarten, Bedeutungsnotizen, Einschränkungen, Dialekten, verwandten Begriffen und Herkunft werden als JSON im optionalen verborgenen Schemafeld `dictionary_data` gespeichert.

Ein Treffer füllt den geöffneten Editor; mehrere Treffer erscheinen zur Auswahl und Bestätigung in einer horizontalen Vorschau. Vokabelabfragen erhalten den eingegebenen Text und die Komposition. Lesungen und Definitionen werden sofort übernommen. Jede Bedeutung, auch durch Semikolon getrennte Angaben, wird eine eigene Definition. Fehlende UI-Sprachen ergänzt optional Cognis über die Lokalisierungsfähigkeit; das Modul erfindet keine Übersetzungen und kopiert kein Englisch in andere Sprachen. Quell-URLs und vollständige Originaldaten stehen ausschließlich in verborgenen `dictionary_data`-Metadaten.

Schemarevision 88 und Modul-/Inhaltspaketversion 2.2.84 veröffentlichen das Quelldatenfeld. Alle Bedeutungen können über die Host-Vorschau importiert oder innerhalb des Definitionslimits ausgewählt werden. Das vollständige Originalergebnis bleibt unabhängig von den verknüpften Bedeutungen gespeichert.

## Eigenständige Kanji-Suche

Kanji außerhalb der mitgelieferten Inhalte verwenden jetzt Jishos Kanji-Seite statt der Wort-API. Der Anbieter importiert Kun-/On-Lesungen, Bedeutungen, Strichzahl, Schulstufe, JLPT-Stufe und Häufigkeit. Lesetrennzeichen entfallen in der Aussprache; die Originalnotation bleibt in dictionary_data erhalten. Anbieterfehler werden als Suchfehler statt als leere Ergebnisse gemeldet. Der KanjiVG-Anbieter deklariert seine Strichmuster-Fähigkeit und das zugehörige Feld ausdrücklich. Modul-/Inhaltspaketversion 2.2.85 behält Schemarevision 88 bei.

## Identifizierte Jisho-Anfragen

Kanji- und Wortanfragen an Jisho senden jetzt einen beschreibenden Cognis-User-Agent. Damit werden die mit Nodes Standardkennung beobachteten HTTP-403-Antworten behoben, auch bei der Suche nach 教. Fehlerprotokolle enthalten einen sicheren Fehlercode und, sofern verfügbar, den HTTP-Status. Sie unterscheiden Ablehnung durch den Anbieter, ungültige Antwortformate und Übertragungsfehler, ohne Antwortinhalte aufzuzeichnen. Modul-/Inhaltspaketversion 2.2.86 behält Schemarevision 88 bei.

## Unsichtbare Wörterbuchherkunft

Jisho-Vorschläge speichern ihre genaue Quelladresse zusammen mit dem vollständigen Quelldatensatz im unsichtbaren Feld dictionary_data. Cognis importiert diese Metadaten direkt ohne sichtbare Quellenlinks oder Ergebnisfenster. Modul-/Inhaltspaketversion 2.2.87 behält Schemarevision 88 bei.

## Einzelne Wörterbuchbedeutungen

Jisho-Wortergebnisse liefern jede englische Bedeutung als eigene Definition, statt Bedeutungen durch Semikolon zusammenzufassen. Semikolons innerhalb einer gelieferten Bedeutung werden ebenfalls getrennt. Jede Definition erhält eine eigene Herkunftskennung; der verborgene Quelldatensatz behält alle Bedeutungen und Anbieterfelder. Modul und Inhaltspaket verwenden Version 2.2.88 bei Schemarevision 88.

## Aussprache aus dem Wörterbuch

Wörterbuchimporte lösen vollständige Aussprachen über die längsten vollständigen Treffer in installierte Kana auf. Zusammengesetzte Zeichen wie きょ und っく sowie wiederholte Positionen bleiben erhalten. Kanonische Eintragskennungen werden in geordneten Lesegruppen gespeichert; Lesungen mit fehlenden Zeichen werden nicht teilweise verknüpft. Definitionen verwenden passende Karten erneut oder erstellen Karten über den normalen Editorablauf. Karussells bleiben der wichtigste Weg zur Erstellung untergeordneter Karten. Zeichen und Partikeln bleiben schreibgeschützte, vom Anbieter verwaltete Ebenen. Satzeditoren bieten keine Wörterbuchsuche an.

## Alle Wörterbuchkandidaten

Ein Treffer füllt den geöffneten Editor; mehrere Treffer erscheinen zur Auswahl und Bestätigung in einer horizontalen Vorschau. Vokabelabfragen erhalten den eingegebenen Text und die Komposition. Lesungen und Definitionen werden sofort übernommen. Jede Bedeutung, auch durch Semikolon getrennte Angaben, wird eine eigene Definition. Fehlende UI-Sprachen ergänzt optional Cognis über die Lokalisierungsfähigkeit; das Modul erfindet keine Übersetzungen und kopiert kein Englisch in andere Sprachen. Quell-URLs und vollständige Originaldaten stehen ausschließlich in verborgenen `dictionary_data`-Metadaten.

## Wörterbuchsuche und Cache

Cognis Core besitzt den Wörterbuchcache über `core:cache`. Abfragen werden nach einer Stunde kalt und bei weiterer Nutzung geprüft. Änderungen werden an Zwölf-Stunden-Grenzen veröffentlicht; unveränderte Inhalte bleiben erhalten. Gleichzeitige Anfragen teilen eine Prüfung, fehlgeschlagene Prüfungen erhalten gültige Cache-Daten und der persistente Cache überlebt Neustarts. Module planen keine Wörterbuchabfragen und speichern keine Wörterbuchantworten. Jisho bietet keinen leichten Änderungsfeed; Prüfungen benötigen normale Suchantworten. Es gibt keine manuelle Aktualisierung. Lokale Links verwenden aktuell zugängliche Bibliothekskarten.

## Voraussetzungen für Satzimporte

Jishos Wort-API (`/api/v1/search/words`) liefert Wortformen, Lesungen, Bedeutungen, Markierungen und Wortarten. Eine Satzanfrage kann einzelne Wörter liefern, enthält aber keine Satzübersetzung, Tokenpositionen, Flexionszuordnung oder Partikelbindung. Beispielsatzsuche ist eine Korpussuche, keine Übersetzung beliebiger Eingaben. Zuverlässiger Ein-Klick-Import benötigt einen japanischen morphologischen Analysator mit Positionen, Grundformen, Wortarten und kontextuellen Lesungen, einen Übersetzungsanbieter und einen modulverwalteten Graphplaner für Cognis-Transformationen. Der Plan muss den ursprünglichen Satz samt Satzzeichen exakt rekonstruieren, Aussprachen mit vorhandenen Kana verknüpfen, vorhandene Wörter, Partikel und Zeichen bevorzugen und nur fehlende bearbeitbare Vokabeln oder Kanji samt Definitionen erzeugen. Zeichen und Partikel bleiben anbieterverwaltet. Der Host prüft Graph, Bereiche, Zugriffsrechte, Mehrdeutigkeit, Duplikate und atomare Rückabwicklung. Jisho ergänzt Wort- und Kanji-Knoten, stellt aber diese Verarbeitung nicht allein bereit. Eine Satzimportfunktion wird erst nach ihrer Implementierung angekündigt.

## Maßgebliche Suche

Wort- und Kanji-Anfragen beziehen maßgebliche Jisho-Daten auch bei Treffern im Inhaltspaket. Lokale Inhalte dienen nur als Ersatz, wenn Netzwerkabrufe ausdrücklich nicht verfügbar sind; Kana werden lokal durch den Anbieter aufgelöst. Die Einzelzeichen-Kanji-Suche liefert Kun-/On-Lesungen, Bedeutungen, Strichzahl, Schulstufe, JLPT und Häufigkeit. Anfragen verwenden einen Cognis-User-Agent, ein Zeitlimit von 15 Sekunden und sichere Fehlerprotokolle. Übertragungsfehler werden nicht als leere Treffer ausgegeben.

## Stabile Wörterbuchsuche

Jisho lädt auf Host-Anfragen aktuelle Wort- und Kanji-Daten. Exakte Wort- und Lesungstreffer stehen vor verwandten Treffern, bevorzugt in Kana geschriebene Einträge behalten diese Form, und reine Wikipedia-Titel werden ausgeschlossen. Fehlende Lesungen werden weder zu Definitionen noch zu erfundenen Aussprachen. Definitionen und Quelldaten bleiben getrennt; sämtliche Cacheregeln liegen bei Cognis.

Cognis Core verwaltet den Wörterbuchcache über `core:cache`. Eine gespeicherte Anfrage wird nach einer Stunde kalt; bei der nächsten Nutzung prüft Cognis den Anbieter auf Änderungen. Geänderte Ergebnisse bleiben bis zur Zwölf-Stunden-Grenze vorgemerkt, unveränderte Inhalte bleiben erhalten. Gleichzeitige Anfragen teilen eine Prüfung; fehlgeschlagene Prüfungen behalten das letzte erfolgreiche Ergebnis. Der Zustand übersteht Neustarts. Module laden Anbieterdaten, planen aber weder Anfragen noch eigene Antwortcaches. Jisho bietet keinen schlanken Änderungsfeed, daher benötigt eine Prüfung die normale Suchantwort. Es gibt keine manuelle Aktualisierungsschaltfläche. Aussprache- und Kartenlinks werden stets anhand aktuell zugänglicher Inhalte aufgelöst.

## Lesungsgraphen aus dem Wörterbuch

Wörterbuch-Quelldaten bleiben unsichtbare Metadaten in Formularen und Detailansichten. Importierte Aussprachen verwenden verborgene Vokabel-Lesungen im selben Bereich wie ihre übergeordnete Karte. Kanji mit mehreren Lesungen erhalten je einen verborgenen Datensatz mit Titelverweis zum Kanji und geordneten Kana-Verweisen; Kanji mit einer Lesung verweisen direkt auf Kana. Vollständige Wortlesungen verwenden verfügbare passende Kanji-Lesungssegmente und verbleibende Kana. Definitionen werden direkt mit den verborgenen Lesungen verknüpft. Cognis löst Anbieteridentitäten auf und speichert den Graphen atomar mit normaler Feld-, Ebenen-, Abhängigkeits- und ACL-Prüfung. Zeichen und Partikeln bleiben anbieterverwaltet. Redundante Katakana-Wiederholungen einer gleichwertigen Hiragana-Lesung werden herausgefiltert, sofern das Wörterbuch keine entsprechende Katakana-Schreibweise angibt; verbindliche On-Lesungen und echte Lehnwortlesungen bleiben erhalten.

## Validierte Operationsstufen

KanjiVG-Strichmuster verwenden einen getrennten, begrenzten Modulcache: höchstens 512 Bezeichnungen, erfolgreiche Antworten für 24 Stunden und fehlende Dateien für fünf Minuten. Gleichzeitige Abrufe teilen Anfragen; Fehler werden verworfen. Dieser Dateicache steuert weder Wörterbuchsuche noch Navigation. Jisho und KanjiVG nutzen den deterministischen Datenlader `api/reuse/content.js`; der Strichanbieter nutzt `api/reuse/lookup-cache.js`. Modul- und Inhaltspaketversion 2.2.96 behalten Schemarevision 88 bei. Jisho registriert sich über `study:library:provider` mit `searchable: true` und der Fähigkeit `dictionary`. Unterstützt werden Kana, Kanji und Vokabeln; Sätze und die Erstellung anbietereigener Partikel bleiben ausgeschlossen.

## Häufige Wörterbucheinträge

Bei gleich genauen Treffern stehen von Jisho mit is_common markierte Einträge vor seltenen Einträgen. Exakte Treffer bleiben vor verwandten Treffern. Jisho liefert keine Häufigkeit einzelner Bedeutungen: Definitionen behalten die ursprüngliche Reihenfolge, darunter room an erster Stelle für 室, statt vom Editor umgekehrt zu werden.

## Wörterbuchtransformationen

Transformationskarten richten Titel, Lesungen und Definitionen in einer gemeinsamen Spalte aus. Die Grundform-Aktion verwendet den neutralen Schaltflächenstil. Beim Ziehen zeigt eine vertikale Einfügemarke die Position vor oder nach der Zielplatzierung. Jisho-Importe speichern unterstützte Konjugationsfamilien als Vokabel-Tags; neu erstellte Verben öffnen vor dem Einfügen die Transformationsauswahl. Adverbien behalten ihre Wortart; das aktuelle japanische Schema definiert keine Adverb-Transformationen.

Wörterbuchanbieter können prerequisites als Liste von { key, layer, label } zurückgeben. Nach Auswahl eines Treffers im Editor löst Cognis vorhandene zusammengesetzte Schriftkarten im vorgesehenen Sichtbarkeitsbereich auf oder ruft fehlende Karten ab und erstellt sie samt Definitionen und Lesungsgraph. Atomare Zeichen und Partikeln können so nicht erstellt werden. Alias-Schlüssel werden in der Hauptkarte und versteckten Lesungen durch kanonische IDs ersetzt. Die Vokabeleingabe bleibt erhalten; importierte Schriftverweise gelten nur, solange die Eingabe der Suche entspricht. Das Anzeigen von Suchergebnissen erstellt keine abhängigen Karten.

Fehlende Pflichtfelder werden vor dem Speichern über registrierte ergänzende Anbieter vervollständigt; Kanji-Strichmuster stammen von KanjiVG. Jedes Kanji wird zusammen mit seinen Definitionen und versteckten Lesungen als ein validierter Graph im vorgesehenen Sichtbarkeitsbereich gespeichert.

## Schrift der Kanji-Aussprache

Die Kanji-Abfrage wandelt Jishos On-Lesungen in Katakana für Kartenaussprachen und Lesungsverknüpfungen in Hiragana um. 僕 enthält neben しもべ auch ぼく. Identische Kun- und On-Aussprachen werden nach der Umwandlung zusammengeführt; die ursprüngliche Schreibweise wie ボク bleibt in den verborgenen Wörterbuchmetadaten erhalten. Katakana-Schreibweisen von Vokabeln und die Filterung doppelter Suchlesungen behalten ihr bisheriges Verhalten.

Die primäre Lesung folgt häufigen exakten Worttreffern von Jisho: 僕 zeigt zuerst ぼく und danach しもべ. Verwandte Wörter und nicht belegte Kanji-Lesungen ändern die Reihenfolge nicht. Schlägt die Wortabfrage fehl, bleibt das Kanji-Ergebnis nutzbar und der Fehler wird sicher protokolliert.

## Erkunden-Navigation

Schemarevision 89 legt die Erkunden-Pfade `kana`, `kanji`, `vocabulary` und `sentences` unter `/study/explore/ja/` fest. Modul und Inhaltspaket haben Version 2.2.99. Cognis verwaltet Importe, Grenzen, Stapelfreigaben und Navigation; das Modul liefert deklarative Ebenennamen und Wörterbuchdaten.

## Lernkarten-Startdecks

Der japanische Anbieter liefert drei Startdecks in `data/starter-decks.json`: Hiragana-Grundlagen, Kanji im Alltag und Erste japanische Wörter. Jedes Deck hat einen stabilen Schlüssel, übersetzte Namen, eine Schema-ID und Quelldatensatz-IDs. Der Sprachdeskriptor stellt die deklarativen Daten als `starterDecks` bereit. Cognis löst die IDs zu aktuellen kanonischen Library-IDs auf, blendet unvollständige Decks und deaktivierte Anbieter aus und verwaltet Ansicht, Favoriten, Freigaben und Lernfortschritt. Das Modul erstellt keine Decks und fragt die Host-Datenbank nicht ab.

## Review und Lebenszyklus

Das japanische Modul 2.2.100 verlangt direkt `study:library:provider` und entfernt Suchanbieter bei Fehlern im Import, in der Capability-Veröffentlichung oder in der Flow-Registrierung. Schema 89 und Inhaltspaket 2.2.99 bleiben erhalten; diese Version ändert Integration und Lesbarkeit, nicht die Sprachdaten.

## Erweiterte Startdecks

Japanisch liefert sechs Startdecks: vollständige Hiragana- und Katakana-Reihen mit je 46 Karten, zehn Kanji, neun Wörter, acht Verben und zwölf Sätze. Bestehende Schlüssel bleiben stabil; alle Mitglieder sind sichtbare Anbieterdatensätze.

## Inhalte und Verträge

Höfliche Ortsfragen erhalten das abschließende か mit kanonischer Partikelkarte und vier Übersetzungen. Satzidentitäten bleiben erhalten. Aktivierungsfehler entfernen Suchanbieter und protokollieren sichere Metadaten. Die Anleitung verankert ctx als Anwendungsrückgrat und belässt die Ableitung der Satzaussprache beim Host.

## Optionale japanische Kollektivplurale

Schema 90 und Inhaltspaket 2.2.102 deklarieren sechs geprüfte Gruppen belebter Substantive und Pronomen über Cognis’ optionalen Transformationsvertrag (`optInTag: plural`). `たち` bezeichnet eine Gruppe oder zugehörige Personen und ist keine allgemeine englische Zahlenendung. Bezeichnung, Lesung und lokalisierte Definition werden gemeinsam transformiert; Satzreferenzen behalten die Basiskarte. Das Dataset enthält keine doppelten abgeleiteten Pluralkarten. Modulversion: 2.2.102.

## Beitragsstandard der Vorlage

AGENTS.md mit der externen Modulvorlage synchronisieren und Domänenregeln beibehalten. Den kanonischen Release-Verzeichnispfad übernehmen; historische Inhalte und dauerhafte Modulidentität erhalten.

## Standardstruktur und eigene Integration

Vorlagenrichtlinien, domänenspezifische Routenpfade, übersetzte Integrationsdokumentation, ausführbare Strukturprüfungen und endgültige Paket-Hashes synchronisieren. Öffentliche URLs und Modulidentität bleiben erhalten. Browserbeiträge folgen den Lebenszyklusverträgen des zuständigen Hosts.

## Lernmarke und Bildmaterial

Das Modul heißt jetzt Japanisch lernen und erhält ein passendes PNG-Icon und Banner. Wichtige Bildinhalte bleiben im sicheren mittigen Marketplace-Bereich. Sichtbarer Name und Integrationsdokumentation werden übersetzt und aktualisiert; Modul-UUIDs, Sprachcodes, Paketnamen und Inhaltsidentitäten bleiben erhalten.

## Einheitliche Marketplace-Texte

Verwenden Sie kurze Aktionszusammenfassungen und konkrete Funktionsbeschreibungen in den Marketplace-Metadaten mit inhaltlich abgestimmten Übersetzungen.

## Aussprachedarstellung vereinheitlichen

Study stellt öffentliche Ausspracheklassifizierung und Stile für Library-Vorschauen, Detailüberschriften, Varianten, Lernkartenantworten und Leseoptionen sowie den Zeichenbereich bereit. IPA behält seine ursprüngliche Notation; normale Lesungen behalten die gewählte App-Typografie. Japanische und englische Satzschemata verlangen mindestens zwei Wortverweise.

## Sprachschlüssel ohne wörtliche Ersatztexte verlangen

Die KI-Anweisungen verbieten fest kodierte englische Benutzertexte in allen Abläufen. Fehlende Werte der bevorzugten Sprache dürfen dieselben Schlüssel der englischen XML-Ressourcen verwenden. Fehlende oder leere englische Ersatzwerte müssen ausdrücklich einen Fehler auslösen, statt englische Literale, rohe Schlüssel oder leeren Text anzuzeigen. Fehler wegen fehlender Übersetzungen dürfen nicht unterdrückt werden.

## Vollständige Wörterbuchgraphen liefern

Jisho-Kandidaten ohne vollständige Kana-Rekonstruktion werden abgelehnt. Kanji-Lesungen verweisen direkt auf Definitionen desselben Importgraphen; Kanji und nicht zugeordnete Wörter erhalten semantische Klassen.

## Kanji-Lesungsstämme erhalten

Bei Kun-Lesungen mit Punkt bleibt nur der Kanji-Stamm: `おし.える` ergibt `おし`; die Originalnotation bleibt in versteckten Metadaten.

## Glatte quadratische Kurven abtasten

Glatte quadratische SVG-Befehle spiegeln den vorherigen quadratischen Kontrollpunkt; kubische und quadratische Verläufe bleiben getrennt.

## Entfernte Strichanfragen begrenzen

Strichmustersuchen akzeptieren höchstens sechzehn Schreibeinheiten, teilen eine Frist von fünfzehn Sekunden zwischen den Glyphenanfragen und brechen Antworten über einer Million Bytes ab.

## Aufbau der Study-Module

Das Inhaltspaket liegt in `data/library/`: Manifest, Schema und Inhaltsdateien bilden eine gemeinsame Import- und Löschgrenze. Startdecks bleiben in `data/starter-decks.json`. Laufzeitanbieter liegen in `api/dictionary/` und `api/strokes/`; deterministisches Laden und bytebegrenztes Dekodieren von Antworten liegen in `api/reuse/`. Übergreifende Inhalts- und Lebenszyklustests liegen in `tests/`, Anbieter-, Transport- und API-Tests in `api/tests/`. Das Manifest deklariert `api/routes/config/index.js` als `disabledApi`; dieser Einstiegspunkt registriert nur die administrative DELETE-Konfigurationsroute und aktiviert weder Inhalte noch Anbieter. Veröffentlichte Ablaufkennungen bleiben stabil.

## Wiedergabe mit Pausen und manueller Ersatz

Die Startaufnahmen verwenden das offline betriebene mehrsprachige neuronale Kokoro-Modell mit `bf_emma` für Englisch und `jf_alpha` für Japanisch. Die Clips haben 128 kbit/s, 200 ms Vorlauf, 180 ms Nachlauf, begrenzte Spitzennormalisierung und langsameres Sprechtempo. Modellherkunft und Apache-Lizenz stehen in `data/audio/VOICE-LICENSE.txt`; das Aufnahmeverzeichnis dokumentiert Stimme und Verarbeitung.

Satzkarten können ein optionales Audiofeld besitzen. Beim ersten Abspielen prüft Cognis den Zugriff auf jeden Bestandteil, wählt nur die erste Aussprachegruppe, wendet gewählte Transformationen an und erzeugt eine durchgehende WAV mit stillem Vorlauf und gezielten Wort-, Komma- und Satzpausen. Die Aufnahme wird privat zwischengespeichert; Bestandteildaten, Lesungen, Transformationen und Pausen bestimmen die Identität. Neue und vorhandene Karten werden bei Bedarf verarbeitet. Eine im normalen Editor hochgeladene Audiodatei ersetzt die generierte Wiedergabe sofort. Nach Entfernen dieser Datei erfolgt wieder die automatische Zusammensetzung. Anbieter liefern Wortaufnahmen; Cognis verwaltet Zusammensetzung und Cache.

## Abdeckung der Referenzverzeichnisse

Der japanische Referenzkatalog umfasst alle 13.108 Zeichen der mitgelieferten offiziellen KANJIDIC2-Daten. Der englische Katalog enthält alle 135.969 lexikalischen Einträge von Open English WordNet mit 127.311 normalisierten Schlüsseln. Es sind eigenständige, bedarfsgeladene Wörterbuchanbieter und keine 149.077 sofort importierten Startkarten. In der Study-Suche das Referenzwörterbuch wählen, um unterstützte Einträge über die normale Graphprüfung zu importieren. Fehlende Bedeutungen und nutzbare Lesungen bleiben unbekannt; Aussprache, Übersetzungen und Strichbilder werden nicht erfunden. Das Verzeichnis umfasst weder alle Unicode-Han-Zeichen noch jedes denkbare englische Wort.

Japanische Kanji-Lesungen werden nach häufigen JMdict-Belegen und verfügbaren Häufigkeitsmarkern einschließlich Okurigana-Formen geordnet. Gruppierte Verweise und Startaufnahmen folgen genau dieser Reihenfolge. Kanji-Audio verwendet immer die erste verfasste Aussprache. Vorhandene englische Wortkarten haben jeweils eine IPA-Lesung; Referenzeinträge bewahren die Quellreihenfolge innerhalb der bevorzugten britischen Varietät vor anderen Varietäten. Aussprachehäufigkeit hängt vom Kontext ab; die Quellen liefern keine allgemeingültige Rangfolge für jede Lesung.

## Vollständige Ausspracheaufnahmen der Referenzdaten

Japanisch enthält zusätzlich 2.913 neuronale Aufnahmen vollständiger Lesungen in begrenzten Dateien unter `data/audio/reference/`. Zusammen mit den Startaufnahmen decken sie die erste Lesung aller 12.356 Quellzeichen mit bekannter Lesung ab; für die übrigen 752 Zeichen werden keine Aussprachen erfunden. Der Index wählt die erste verfasste Lesung und prüft Dateigrenzen und Abbruch. Mit `python3 scripts/reference-audio.py plan --work <directory>` einen Plan erstellen, dessen Verzeichnisse mit dem Syntheseskript verarbeiten und mit `pack` die begrenzten Dateien schreiben.

Das japanische Sortierwerkzeug akzeptiert `--dictionary <JMdict.gz> --kanji-dictionary <KANJIDIC2.xml.gz> --output <priorities.json>` und optional `--content-root data/library/content`. Es bevorzugt häufige eigenständige Wortlesungen, ordnet weitere Lesungen nach häufigkeitsgewichteten Zuordnungen belegter Wörter und erhält geprüfte Einzelkarten-Vorgaben aus `data/audio/primary-readings.json`. Stimmhaftigkeit und Gemination werden auf kanonische Quelllesungen zurückgeführt. Kun-, On- und Namenslesungen bleiben verfügbar; allein die erste ausgewählte Lesung bestimmt Wiedergabe und Cache-Identität. Häufigkeitsmarker dienen der Reihenfolge und sind keine allgemeingültige Aussprachemessung.

## Optionale Sprachintegration

ElevenLabs ist als optionale Modulabhängigkeit deklariert. Bei der Installation kann es für Sprachsynthese ausgewählt werden; Study-Aktivierung sowie manuelle und zusammengesetzte Audioaufnahmen bleiben ohne dieses Modul verfügbar.

## Sprache ohne Sonderrechte bereitstellen

`elevenlabs-tts:synthesis` im eigenen Modulnamensraum veröffentlichen und die Privilegien-Markierung entfernen. English und Japanese Study lösen diese Fähigkeit über ctx und ihre bestehende optionale Modulabhängigkeit auf. Die Study-Brücke erhält den aktuellen Fähigkeitszugriff vom Aufrufer und bewahrt Deaktivierung, erneute Aktivierung und konfigurierte Stimmen.

## Sprache optional halten

Die veröffentlichte Fähigkeit meldet ihre aktuelle Bereitschaft über `configured`. Study aktiviert automatische Sprache erst nach dem Speichern von API-Schlüssel und Standardstimme. Fehlt ElevenLabs oder ist es deaktiviert oder unkonfiguriert, gelingt die Sprachregistrierung weiterhin. Hochgeladene Aufnahmen und die Zusammenstellung vorhandener Audios bleiben verfügbar; Synthese wird nicht angefordert.

## Installation ohne gebündelte Medien reparieren

Die ungenutzte Medienverzeichnis-Deklaration aus dem reinen Datenpaket entfernen und dessen Version erhöhen. Deklarierte Paketpfade anhand einer temporären Installation ausschließlich aus verpackten Dateien prüfen, damit die Aktivierung nicht von leeren lokalen Verzeichnissen abhängt.

## Konsistente Sprachaufnahmen

Festgelegte Sprachaufnahmen werden für jede vertonte kuratierte Karte und jede erreichbare Plural-, Verb- oder Adverbform mitgeliefert. Satz-WAV-Dateien verwenden exakt die geordneten PCM-Daten der Bestandteile einschließlich ausgewählter Transformationen. Stimme, Modell, Anforderungen, Prüfsummen und Stilleprüfungen sind dokumentiert; Zugangsdaten werden nicht mitgeliefert.

## Gespeicherte Lernsteuerung

Japanische Aufnahmen mit kleinen Kana, einschließlich 学校, wurden mit Kanji-Schreibweise, soweit vorhanden, der festgelegten japanischen Stimme und stabilen Einstellungen neu erzeugt. Mitgelieferte Sätze werden aus genau diesen Clips neu zusammengesetzt. I- und Na-Adjektive unterstützen Adverbial-, Verneinungs- und Vergangenheitsformen mit eigenen Aufnahmen der mitgelieferten Formen. Englische Pluralaufnahmen bleiben eigenständige Dateien und werden bei gewählter Form abgespielt.

## Referenzbilder

Optionale Bildlistenfelder, private Bild-Uploads und Detailgalerien ergänzen. Beide Sprachmodule enthalten ein lizenziertes Referenzfoto und bieten das Feld auf jeder Ebene an.

## Direkte Satzaufnahmen

Mitgelieferte Sätze verwenden direkt erzeugte vollständige Satzaufnahmen vor zusammengesetztem Audio. Neue oder nicht aufgezeichnete Sätze nutzen die Zusammenstellung des Hosts mit exakt geordneten PCM-Bestandteilen und ausgewählten Transformationen; fehlende Varianten werden niemals durch die Grundform ersetzt. Die Aufnahmen decken das kuratierte Paket ab, nicht jeden Wörterbucheintrag oder möglichen selbst verfassten Satz. Enthält 34 neu erzeugte Satzaufnahmen mit Stimme `xya0RvcJtofTcFTOdX4E`. Japanisch erzeugt 124 Kana-Clips neu und sendet Kana/Kanji statt Romaji. Anforderungen behalten dokumentierte stabile Modelle, Geschwindigkeit, Ähnlichkeit, Startwerte und Stimmnachweise.

## Referenzfotos für Vokabeln

33 kuratierte Vokabelkarten enthalten jetzt mitgelieferte Referenzfotos (32 Bilddateien). Alle konkreten Substantive sowie bildlich klare Handlungen und Eigenschaften sind abgedeckt; Grammatik, Pronomen und andere abstrakte Begriffe erhalten keine irreführenden Füllbilder. Japanische Homophone wie 花/鼻, 橋/箸, 雨/飴 und 紙/髪/神 verwenden unterschiedliche Referenzen. Die Bilder werden lokal in der vorhandenen Detailgalerie und Vollbildvorschau geladen. Quelltitel, Urheber, individuelle Creative-Commons- beziehungsweise Gemeinfreiheitslizenzen und Prüfsummen stehen im [Bildkatalog](../../data/library/assets/images/catalog.json) und in den [Bildnachweisen](../../data/library/assets/images/LICENSE.md). Eigene Kartenbilder bleiben beim erneuten Laden der Anbieter durch den Host geschützt.

## Vokabelillustrationen

Jede mitgelieferte Vokabelkarte besitzt jetzt eine eigene generierte Illustration im Anime-Stil (70 Karten). Konkrete Gegenstände, Handlungen und Kontextbilder für abstrakte Begriffe erscheinen in der vorhandenen Kartendetailgalerie und Bildvorschau. Die bisherigen Quellfotos wurden ersetzt. Der [Bildkatalog](../../data/library/assets/images/catalog.json) dokumentiert Erzeugungsquelle, Stil, Bildausschnitte, Prüfsummen und Kartenzuordnungen; die [Bildlizenz](../../data/library/assets/images/LICENSE.md) beschreibt die mitgelieferten Illustrationen. Bilder werden lokal geladen, eigene Benutzerbilder bleiben bei Anbieter-Neuladevorgängen durch den Host erhalten.

## Haushaltsvokabular

Fünfzehn Alltagsnomen ergänzen Möbel, Kleidung, Gegenstände und Lebensmittel mit Bedeutungen in vier Sprachen, Ausspracheverknüpfungen, eigenen Aufnahmen und einem Stapel für Alltagsgegenstände. Zählbare englische Nomen enthalten aufgenommene Pluraltransformationen, einschließlich des unveränderten Plurals fish; rice bleibt ein Stoffname. Japanische Anfängerschreibweisen verknüpfen vollständige Lesungen mit einzelnen Kana, einschließlich des Langvokalzeichens ー in テーブル und コート.

## Lebensmittel und Körperteile

32 illustrierte Substantive ergänzen jeweils sechzehn Lebensmittel und Körperbegriffe mit Bedeutungen in vier Sprachen sowie eigenen Lernstapeln für Lebensmittel und Körperteile. Englisch enthält 25 aufgenommene Zahltransformationen, darunter feet, teeth, potatoes und mouths mit stimmhaftem Konsonanten; Stoffnamen wie Hühnerfleisch, Rindfleisch, Butter und Haut erhalten keine Pluralfamilie. Japanisch bewahrt vollständige Verknüpfungen zu einzelnen Kana, trennt die Bedeutungen Fuß und Bein von あし in eigene Definitionen und verwendet vorhandene muttersprachliche Aufnahmen bei identischen Ausspracheeingaben weiter. Vier einzeln verfasste Beispielsätze pro Sprache besitzen direkte neuronale Aufnahmen mit Vorrang vor exakt aus den Bestandteilen zusammengesetzten Satzaufnahmen. Alle Illustrationen werden lokal im etablierten sprachspezifischen Zeichenstil mitgeliefert.

## Review-Korrekturen und Aufnahmeinventare

Aufnahmemetadaten verwenden ein kompaktes Manifest und prüfsummengesicherte Inventare für Zeichen, Wortschatz, Transformationen, Sätze und Satzzusammensetzungen. Audiodaten, Stimmen-/Anfrageherkunft und Suchpriorität bleiben erhalten. Referenzimporte lesen die paketierte Sprache; die Bereinigung versucht auch nach Fehlern alle Registrierungen zu entfernen. Wörterbuchfehler geben Antwortdaten frei und Referenzinhalte können erneut geladen werden. Die Dokumentation beschreibt die aktuelle Konfiguration und generierte Bilder.

## Vollständige japanische Suchergebnisse

Jisho-JSON und Kanji-HTML verwenden den gemeinsamen Leser mit Bytebegrenzung. Alle maßgeblichen Bedeutungen bleiben erhalten, einschließlich der vierzehn Bedeutungen von 節. Entfernte Schreibvorlagen für kleine Kana verwenden dieselben Proportionen wie die mitgelieferten Vorlagen. Historische Herkunftsverweise nutzen vollständige unveränderliche Implementierungs-Hashes aus der erhaltenen Repository-Historie.

## Explizite Katalognormalisierung und Satzkompositionen

Der Katalogleser erhält seine Normalisierungsregel vom Sprachanbieter: NFC für Englisch, NFKC für Japanisch. Gemeinsamer Suchcode verzweigt nicht mehr nach einer bestimmten Sprache. Die Inventare heißen `sentence-compositions`; jeder Eintrag beschreibt eine echte paketierte Aufnahme aus geordneten Einzelaufnahmen. Direkte neuronale Satzaufnahmen bleiben getrennt und haben Wiedergabevorrang.

## Lokalisierte Bildbezeichnungen und neutrale Dateinamen

Dateinamen und IDs der Illustrationen verwenden ihren SHA-256-Hash; Quellblätter verwenden den Hash ihrer Quelldaten. Die Katalogmetadaten liefern deutsche, englische, indonesische und japanische Bezeichnungen aus den vorhandenen Bedeutungen der Karten. Anzeige und neutrale Speicherkennung sind getrennt. Bilddaten und Kartenidentitäten bleiben unverändert; Inhaltsrevisionen aktualisieren alle Bildverweise.

## Nutzung

ElevenLabs-Synthese in ein eigenes konfigurierbares Modul verlagern. Study nutzt optionale sprachbezogene Stimmen für gespeicherte globale Karten. Private und Klassenkarten erlauben begrenzte Uploads und Mikrofonaufnahmen. Die kontinuierliche Satzkomposition aus vorhandenen Aufnahmen bleibt als Rückfall erhalten. Administratoren können globale Audios im Editor neu erzeugen.

## Study-Aktivierung reparieren

Die tatsächlichen englischen und japanischen Inhaltspaketversionen beim Entfernen gebündelter Aufnahmen erhöhen. Unabhängige Module werden vor der Fehlermeldung vollständig abgeglichen, damit Einwilligungsrouten ihre registrierten Flows behalten.

## Alle Aufnahmen neu erzeugen

Alle 3273 gebündelten Aufnahmen verwenden nun die konfigurierte ElevenLabs-Stimme dieser Sprache. Verfasste Lesungen, Kartenidentitäten, leise Vorläufe und die Satzkomposition mit Sprechpausen bleiben erhalten. Das Werkzeug nutzt Zugangsdaten aus der Umgebung, einen fortsetzbaren API-Antwortcache und atomaren Dateiaustausch; Pakete enthalten keine Zugangsdaten. Verzeichnisse, Herkunftsangaben, Inhaltsrevisionen und Integritätsprüfsummen entsprechen den neuen Aufnahmen.

## Commits

- [0b38fbd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0b38fbdfd4c7e9ffc8710b73df259f7d567a33fe)
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
- [b41da01](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b41da011d6026d909c55369d3598e8334bbffe94) — Transformationsmarker an Cognis angepasst.
- [ac2bc76](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ac2bc76bc15ec0898b023e7f170e106935f7a438) — Jede Verbtransformation mit Definitionsanmerkungen versehen.
- [cf02a4a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cf02a4ae4c296f4d67d86ff21c099ecb5bea8a8c) — Transformationsmarker in Verbdefinitionen platziert.
- [5098a12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5098a123745e0ee72e3afad297d81a0505792aa0) — Zusammensetzbare Definitionstransformationen übernommen.
- [da436b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/da436b4e3c0f9b92a7ee895980129d572b633da7) — Kontextabhängige Definitionsersetzungen ergänzt.
- [340b525](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/340b525fc838313d937498bc2fcc8f20c48c75e2) — Zeichenseitenverhältnis und Strichgruppen bewahrt.
- [dee7ab5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/dee7ab5e5f1cbc78a28eb526f0b07c421c151054) — Doppelte Identitätshinweise entfernen.
- [288aa01](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/288aa0165b63cc7810fcf50530df7d49fc1a70c5) — Satzstruktur-Einträge im Composer bereitstellen.
- [0895472](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0895472e7c61aa0858fd6d8a1aa6d6f27852d0ce) — Satzkonnektoren und Kopulaformen erweitern.
- [92992d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/92992d5f65831215de331f4af3da924a006fecb7) — Metadatenvalidierung der Kopula-Transformation korrigiert.
- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6) — Aussprache-Deep-Links im Wortschatz wiederhergestellt.
- [7d529da](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d529da851a5301f3dd04ee4b1d71e17053248f9)
- [5f901fc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5f901fc476e5b4e4e61f18ab612bbd8a3eb9c860)
- [f910563](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9105630f0ee87cad60fc67c99f46a311bcdb68b)
- [785fb21](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/785fb21beeb8addd3160e4dc46e0052f69a5efa1)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- [fdf2319](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594)
- [48b4d1a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4)
- [253824c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b)
- [8f7dc3d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e)
- [1cebe54](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3)
- [89e41b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6)
- [edef816](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae)
- [fc1f65d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fc1f65d25aa2e4d52bef4dc5290eb127a7033a68)
- [618b1c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/618b1c901ac826fd81a584d5ff9baa98c8033d91)
- [84e49de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/84e49de45b43f6f0b0cdb8087eeb03cc40f6389c)
- [94e57eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/94e57eb29bdebb3e64e057e082608a25e72b33d0)
- [315dded](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/315dded455234476da36402728c09b9e64b3fd5d)
- [4db2d6f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4db2d6f76a6328592520ef23528958b42d95e166)
- [fd7b3fa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fd7b3fa218e80d8ce2657666adb544680d925fd5)
- [c002077](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c00207784c18bfafe9548cf449176f74768f0a14)
- [f3d77c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3d77c941a7e44982c1cf60f04cfdbb8e26d2e36)
- [7d637de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d637de2c5429fb58d95f2ad542540fbc7e458b7)
- [1e8c8df](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1e8c8dfcd5c7321519c0ea38d8a8fd788335441e)
- [25322ff](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/25322ff741a62e990f6c4664f0b6083415c649ea)
- [2476657](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2476657ff36854d1a0688680cb9097f2585dad16)
- [5df0f61](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5df0f611c9161f100508565013ea6d43edb2e897)
- [4d7712d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4d7712d1eacf7bbfecf6a48bf6bffc3133afc046)
- [0d7a90c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0d7a90cf679be17bfc39d430ca7552e2a679c74b)
- [6a0ed76](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6a0ed76b5c9afa7d7ab1352cd002630b0b334f90)
- [4b2be81](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4b2be81112494881d4e87e56d19bf94bc1ea801d)
- [293ce22](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/293ce2259636c1c527f4e8b477782f6fc2153198)
- [c6fa056](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c6fa05621ba5a97c218d2aafab91e10e6a2d305c)
- [35759eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/35759eb887310f2bec217c4e4335b0a07323c2f6)
- [13244eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/13244eb79d34f999d74def0e47fe67700fbfb42e)
- [4f906f3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4f906f37c3a33d8b38352f917fd771413c4e98e5)
- [b2de30f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2de30f212b0b9ae28a67008c0393c1116b2fca0)
- [b0b657d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b0b657d09fdc6d8c8ce9ac1388907f25a89304a3)
- [f729231](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f72923181dd412aa76c7501056b19318367524e4)
- [97b6e4d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/97b6e4d20c01a036f30309663731342f7941ad10)
- [5e5849b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5e5849bf9218b5441070a81ac661b7498b684c59)
- [e4c848b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e4c848bcb8d331facdd92f4696b1009de4f1f1d9)
- [544892a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/544892a8987304d982b2953676f5ddc39eb9c728)
- [63629ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/63629ced95d53d31a2621d2bca5d0bbf55a1dceb)
- [f622269](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f62226988d84c4f05100729795f8a15a6b4d828b)
- [b58c961](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b58c961f9d8a62d407ca65afcf89a5c4f1f41bb2)
- [a830ea7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a830ea741ea15dc65e946d0fdf5f235f0724b86b)
- [b5a876d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b5a876d083a52cbf39bc4f3e36b666bd9ec67bb2)
- [42d3707](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/42d3707a861c32064dcf912446092415104c3db6)
