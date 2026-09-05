# Standard für das japanische Inhaltspaket

Das Cognis-Japanisch-Modul installiert deklarative japanische Lerndatensätze in die hosteigene Study-Bibliothek und bleibt dabei von Bibliotheksinternas, Datenbanken, APIs und Browsercode isoliert.

## Verwendung

Aktivieren Sie das Study-Gateway und den Bibliotheksadapter und anschließend dieses Modul. Sein Bootstrap löst `study:library` aus `ctx` auf und übernimmt `data/library`. Administratoren und Lernende verwenden die vom Bibliotheksadapter erzeugte Study-Oberfläche statt einer moduleigenen Route.

Das externe Modul deklariert das Study-Gateway als Komponentenabhängigkeit. Es erkennt den Bibliotheksadapter über die erforderliche Fähigkeit `study:library`, statt die Adapter-UUID als eigenständig installierbare Komponente zu behandeln.

## Technische Spezifikation

### Paketstruktur

`data/library/manifest.json` benennt Paket, unveränderliche Paketversion, Inhaltsrevision, Schema, Inhaltswurzel, Herausgeber und Lizenz. Jedes unmittelbare Inhaltsverzeichnis entspricht einer Ebene in `schema.json`; JSON-Dateien enthalten Arrays stabiler Datensätze.

### Schema und Graph

Das Schema definiert `characters`, `alt-characters`, `definitions`, `words` und `sentences`. Typisierte Felder und gerichtete Beziehungen legen Zielebenen, erforderliche Kardinalität, Reihenfolge und optionale Graphem- oder Längste-Treffer-Auflösung fest. Jede Referenz verweist auf einen anderen Datensatz desselben Pakets.

### Lebenszyklus und Eigentümerschaft

`bootstrap.js` bezieht ausschließlich öffentliche Fähigkeiten über `ctx`, lässt das Paket von der Bibliothek übernehmen, veröffentlicht die japanische Sprachbeschreibung und protokolliert den Beleg. Die Host-Bibliothek besitzt Validierung, Namensraum-IDs, Transaktionen, Idempotenz, Persistenz, Routen und generierte UI. Dieses Modul registriert keine API- oder Seitenrouten und greift auf keine Host-Datenbank zu.

### Aktualisierungen und Lizenzierung

Schemaänderungen erfordern eine höhere Schemaversion. Inhaltsänderungen erfordern eine neue Paketversion oder Inhaltsrevision. Alle gebündelten Datensätze verwenden die im Paketmanifest erklärte Lizenz und Attribution.
