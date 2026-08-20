# Sicherheit

Das Japanisch-Lernmodul schützt seine Bibliotheksoberflächen durch Host-Authentifizierung, rollenbasierte Autorisierung, Grenzvalidierung und sichere Fehlerausgaben.

## Verwendungsbeispiele

- Authentifizieren Sie jede Bibliotheksanfrage über die vom Host bereitgestellte Capability `auth:requireAuth`.
- Fordern Sie vor Bibliotheksänderungen die Rolle Administrator oder Eigentümer an.
- Geben Sie stabile Client-Fehlercodes statt Ausnahmemeldungen zurück.

## Technische Spezifikation

### Autorisierung

Alle Bibliothekslesevorgänge erfordern einen authentifizierten Benutzer. Bibliotheksänderungen erfordern einen Administrator oder Eigentümer; die Autorisierung erfolgt vor dem Einlesen der Anfrage oder vor Speicheroperationen.

### Validierung und Fehler

Anfragekörper sind größenbeschränkt und werden an der API-Grenze validiert. Unerwartete Fehler werden mit strukturierten, nicht vertraulichen Metadaten protokolliert, während Clients stabile Fehlercodes ohne interne Ausnahmedetails erhalten.
