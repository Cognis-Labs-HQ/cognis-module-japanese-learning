# Cognis-Japanischmodul

Das Cognis-Japanischmodul stellt für das Cognis-Study-Gateway eine installierbare Japanischlernumgebung mit Kana- und Kanji-Daten, einer Lernbibliothek und Einstiegspunkten für den Unterricht bereit.

## Vorlagen für Verbraucher

Verbraucher rufen über die `study:library`-Fähigkeit `cloneTemplate` mit genau den benötigten Ebenen auf. Kopien behalten die kanonische Reihenfolge und Beziehungsmetadaten bei, entfernen Verknüpfungen zu ausgelassenen Ebenen und kennzeichnen erforderliche Abhängigkeiten. Beim Erstellen von Wörtern und Sätzen können Verknüpfungen aus normalisierten Zeichen und durch Leerraum getrennten Wörtern abgeleitet werden; ausdrückliche Referenzen bleiben maßgeblich.

Die japanische Study-Unternavigation löst ihre Bezeichnungen für Hiragana, Bibliothek und Unterricht aus dem Locale-Bündel des Moduls auf und leitet Klicks über den Cognis-Host-Router weiter.

## Anwendungsbeispiele

- Öffnen Sie `/study/hiragana`, um das Hiragana-Alphabet zu erkunden.
- Öffnen Sie als Administrator `/study/library`, um die Lerninhalte des Moduls zu prüfen und zu ergänzen.
- Öffnen Sie `/study/ja-classroom`, um über Study eine Japanischunterrichtssitzung zu beginnen.
- Rufen Sie `/api/v1/modules/study-language-ja/study/library/entries?scope=global` mit einem gültigen Cognis-Zugriffstoken auf, um globale Bibliothekseinträge zu lesen.
- Lösen Sie die Capability `study:language:ja` auf, um die Sprachbeschreibung ohne Import von Modulinterna einzubinden.

## Technische Spezifikation

Das Modul ist eine externe Cognis-Erweiterung. Seine dauerhafte UUID identifiziert es versionsübergreifend, und sein `requires`-Eintrag deklariert das Study-Gateway per UUID.

### Integrationsvertrag

- `bootstrap.js` ist der einzige Integrationseinstiegspunkt für die Plattform.
- Das bereitgestellte `ctx` ist der einzige komponentenübergreifende Bus für Routen, UI-Registrierungen, Capabilities und Flow-Hooks.
- Laufzeitimporte bleiben repository-relativ und greifen niemals auf Cognis-Interna oder benachbarte Komponenten zu.
- Bereichsgebundene Registrierungen lassen sich beim Deaktivieren oder Deinstallieren des Moduls entfernen.
- Der Deinstallations-Hook protokolliert die angeforderte Lebenszyklus-Bereinigung, ohne paketierte Lerndatendateien direkt zu löschen; diese Dateien gehören weiterhin zum Modulpaket und werden zusammen mit dem Paket entfernt.

### Sicherheit

- Bibliotheksendpunkte authentifizieren Anfragen, bevor Daten gelesen oder geändert werden.
- Schreibvorgänge erfordern einen Administrator, validieren Datensatzobjekte an der API-Grenze und beschränken Ebenennamen auf eine Positivliste.
- API-Antworten verwenden stabile öffentliche Fehler, ohne Implementierungsdetails offenzulegen.
- Fehler werden mit sicheren strukturierten Metadaten an den Host-Logger übergeben.

### Freigabeprozess

- Halten Sie die Versionen in `manifest.json`, `package.json` und `package-lock.json` synchron und ändern Sie niemals die Modul-UUID.
- Führen Sie vor einem Release-Commit `npm install`, `npm test`, `npm run lint`, `npm run manifest:hashes`, `npm run check:manifest` und `git diff --check` aus.
- Erzeugen Sie `manifest.files` nach der letzten Änderung an einer ausgelieferten Datei neu, damit alle repository-relativen Pfade und SHA-256-Prüfsummen überprüfbar bleiben.
