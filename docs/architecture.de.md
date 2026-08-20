# Architektur

Das Japanisch-Lernmodul stellt japanische Lerninhalte und unabhängig einbindbare Study-Seiten über die Verträge für externe Cognis-Module bereit.

## Verwendungsbeispiele

- Lösen Sie `study:language:ja` auf, um die unveränderliche japanische Sprachbeschreibung zu lesen.
- Lösen Sie `study:language:ja:library` auf, um die mitgelieferten japanischen Lerndatensätze abzufragen.
- Binden Sie `/study/hiragana`, `/study/library` oder `/study/ja-classroom` über den SPA-Router des Hosts ein.

## Technische Spezifikation

### Lebenszyklus und Integration

`bootstrap.js` ist der Einstiegspunkt für den Modullebenszyklus. Die Datei registriert authentifizierte API- und UI-Oberflächen, stellt die unveränderliche Sprachbeschreibung und eine schreibgeschützte Bibliotheks-Capability bereit und fügt die Beschreibung dem Bootstrap-Flow der Plattform hinzu. Der Bootstrap-`ctx` ist der einzige Bus für komponentenübergreifende Integrationen.

### Datenhoheit

Die API ist für Grenzprüfungen zuständig und delegiert das Laden, die Graphvalidierung, Abfragen und die Persistenz japanischer Inhalte an `api/store.js`. Mitgelieferte Quelldatensätze befinden sich unter `data/`.

### Browser-Oberflächen

Die drei Browser-Einstiegspunkte bleiben unabhängig einbindbare Study-Seiten unter `ui/components/`. Sie verwenden vom Host bereitgestellte Seitenverträge und werden ausschließlich über die Register für statische Verzeichnisse und SPA-Routen des Hosts veröffentlicht.
