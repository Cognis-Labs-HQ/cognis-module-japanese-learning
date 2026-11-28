# Technische Referenz

Das Japanisch-Paket stellt Sprachinhalte, Wörterbuchergänzungen, Schreibmuster und Aufnahmen über öffentliche Study-Anbieter bereit.

## Schnittstellen

`bootstrapModule(ctx)` benötigt `study:library:provider` mit `transformationModel: "generated"`, `ingestContentPack`, `registerLookupProvider` und `deleteContentPack` sowie `study:audio:provider`. Es registriert Inhalts- und Medienanbieter, übernimmt `data/library/` und veröffentlicht `study:language:ja`. Die Sprachbeschreibung enthält Paket und Startdecks; Cognis besitzt Navigation, Berechtigungen und Lernoberfläche.

Die administratorgeschützten Routen `GET`, `PUT` und `DELETE /api/v1/modules/study-language-ja/config` führen die Lese-, Speicher- und Löschabläufe des Moduls aus. PUT akzeptiert `voiceId` als Zeichenfolge: leer entfernt die Vorgabe, nichtleere Werte enthalten 1–128 Buchstaben, Ziffern, Unterstriche oder Bindestriche. Der Anfragekörper ist auf 2048 Byte begrenzt. Das Modul deklariert keinen deaktivierten API-Einstiegspunkt.

## Konfiguration

Die optionale `voiceId` wählt erzeugte Sprache ohne Änderung der Herkunft gebündelter Aufnahmen. Einstellungen liegen über `db:executor` in der moduleigenen Tabelle `module_study_language_ja_config`, überstehen Deaktivierung und Neustart und werden bei Deinstallation entfernt. Bibliotheksschema, Inhaltsmanifest, Startdecks und Referenzinventare liegen unter `data/`; diese Inventare bestimmen die Verfügbarkeit statt festgeschriebener Gesamtzahlen im Handbuch.

## Verhalten

### Inhalte und Beziehungen

`data/library/schema.json` deklariert `characters`, `alt-characters`, `definitions`, `words`, `particles`, `sentences`. Datensätze besitzen stabile paketlokale IDs und Bedeutungen in vier Sprachen. Geordnete Referenzen zeigen auf echte Datensätze und bewahren die Zusammensetzungsreihenfolge. Study besitzt UUID-Auflösung, Schemaprüfung, ACLs, Importe, Schreibvorgänge und erzeugte Oberflächen. Sprachcode, unveränderliche Modul-UUID und Anleitungsabschluss-IDs sind keine Übersetzungsschlüssel.

Erzeugte Formen benötigen ein anwendbares Grundkarten-Flag und werden über das Transformationsmodell des Hosts aufgelöst. Sie sind Ansichten aus Grundidentität und Transformationspfad, keine eigenständig gebündelten Karten. Unbekannte oder unanwendbare Transformationen werden abgelehnt statt durch eine Grundform ersetzt.

### Aufnahmen und Schreibmuster

`data/audio/recordings.json` deklariert Inventarformat 2. Zweckindizes in `data/audio/indexes/` verweisen auf prüfsummengeschützte Teile in `data/audio/inventories/`; der Lader prüft Hashes und Anzahlen vor der Audiobereitstellung. `data/audio/unavailable.json` erfasst fehlende Aufnahmen. Die Zuordnung verwendet verfasste Lesung und Transformationspfad; fehlendes Transformationsaudio wird nie durch eine Grundform ersetzt. Satzkomposition verwendet Bestandteilaufnahmen. `elevenlabs-tts:synthesis` wird nur eingerichtet genutzt; die Study-Berechtigung bleibt beim Aufrufer.

Schreibmuster bewahren Strichreihenfolge und Zeichengruppen. Gebündelte Medien verwenden die autorisierten Paketressourcen des Hosts. Deaktivierung entfernt Such-, Audio- und statische Beiträge; fehlgeschlagener Start nimmt Teilregistrierungen zurück. Deinstallation erhält Lerninhalte, außer `deleteContent` ist wahr; dann wird `deleteContentPack` der Bibliothek aufgerufen.

### Wörterbuch und Referenzdaten

Jisho ergänzt japanische Wörter und Kanji über moduleigene Anfrageprüfung. Anfragen haben 15 Sekunden Zeit; abgelehnte Antwortkörper werden abgebrochen. KANJIDIC2-Teile erhalten EDRDG-Quellenangaben und lizenzierte Lesungen/Bedeutungen. Vollständige Kana-Lesungen und geordnete lexikalische Zusammensetzung bleiben maßgeblich; fehlende Werte werden nicht erfunden. Cognis besitzt Abfragecaches und Veröffentlichung.

### Lebenszyklus der Anleitung

Die Sprachanleitung benötigt ausdrückliche Lernsprachenauswahl und registriert sich über `study:libraryTutorials`. Der Host besitzt Ziele und Editorlebenszyklen. Erkennung navigiert nicht; ausdrücklicher Start darf Inhalte öffnen. Der Host speichert Abschlüsse je Konto und stabiler Anleitungs-ID. Zurück, Neustart und Anbieterentfernung geben Flächen ohne automatisches Kartenspeichern frei.

## Sicherheit

Bibliotheksrechte bleiben auch bei privilegierten Sprachpaketen verbindlich. Abfragen und Medien müssen im deklarierten Anbieterbereich bleiben. Wörterbuchquellen und Lizenzen bleiben an Ergebnissen; unvollständige Lesungen oder Bedeutungen werden nicht erfunden. Protokolle enthalten sichere Ereignismetadaten statt Zugangsdaten, vollständiger Nutzlasten oder privater Lerninhalte.

## Referenz

Die folgenden Implementierungs- und Datenquellen definieren den unterstützten Vertrag. Hosthandbücher erklären gemeinsame Darstellung und Persistenz.

- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/bootstrap.js)
- [api/routes/config/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/routes/config/index.js)
- [api/dictionary/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/dictionary/index.js)
- [data/library/schema.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/library/schema.json)
- [data/audio/recordings.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/audio/recordings.json)
- [data/reference/manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/reference/manifest.json)

### Namensprüfung

`npm test` prüft Bindungsnamen mit dem lokalen Syntaxbaumdetektor einschließlich Bootstrap, Skripten, Tests und Testdaten. Syntaxfehler lassen die Prüfung fehlschlagen. Die Regressionstestfälle decken Deklarationen, Parameter, private Mitglieder, TypeScript-Typzusicherungen und zulässige reine Typnamen ab. Die gemeinsamen Regeln beschreibt der [Namensstandard des Hosts](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.de.md#bindungsnamen). Übliche Begriffe wie `args`, `db` und LDAP-`dn` sind zulässig; eigene APIs verwenden denselben kanonischen Namen in Deklarationen, Exporten und Aufrufern. Reine Umbenennungsaliase für Exporte lassen die Prüfung fehlschlagen.
