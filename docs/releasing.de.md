# Veröffentlichung

Der Veröffentlichungsprozess hält die Metadaten des externen Moduls, das Integritätsinventar und die Prüfergebnisse für die Veröffentlichung synchron.

## Verwendungsbeispiele

Führen Sie vor dem Commit einer Veröffentlichung `npm install`, `npm test`, `npm run lint`, `npm run manifest:hashes`, `npm run check:manifest` und `git diff --check` aus.

## Technische Spezifikation

### Versionierung

Halten Sie die Versionen in `package.json`, `package-lock.json` und `manifest.json` synchron. Bewahren Sie die Modul-UUID dauerhaft unverändert auf.

### Integritätsinventar

Erzeugen Sie `manifest.files` nach der letzten Dateiänderung neu und committen Sie das aktualisierte SHA-256-Inventar mit jeder geänderten Datei. Das Manifest darf sich nicht selbst inventarisieren.
