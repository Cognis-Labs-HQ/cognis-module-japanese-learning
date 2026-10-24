# Offline lernen

**Feature-Zweig:** feature-offline-study

## Offline-Modus

Study behält begrenzte, kleine JSON-Schnappschüsse im aktuellen Tab: Schemas, erlaubte Zeichen- und Kartendaten, Speicherorte, gesehene IDs, Favoriten und zuvor geöffnete Kartensätze. Sprachschemas aktivieren dies mit `metadata.offline: { cache: "lightweight" }`. Der Library-Cache umfasst höchstens 16 MB und 100 Lesevorgänge; andere Lesecaches höchstens 4 MB und 100 Lesevorgänge. Audiodaten, Wörterbuchantworten, Zugangsdaten und authentifizierte Dokumente werden nicht dauerhaft gespeichert.

Explore-Vorschauen ermitteln Beziehungen aus bereits autorisierten zwischengespeicherten Datensätzen. Zeichnen funktioniert lokal mit neuen Hilfslinien; Lernkarten lassen sich lokal üben. Audio sowie Wörterbuch- und ElevenLabs-Abfragen werden angehalten. Offline-Übungen speichern keinen Fortschritt, keine XP, Belohnungen, Favoriten oder Änderungen. Nur zuvor geladene Inhalte innerhalb der Cache-Grenzen sind verfügbar; fehlende Abhängigkeiten bleiben unerreichbar.

Privates Study benötigt dieselbe zuvor bestätigte, noch gültige Kontositzung im selben Tab. Nach Neuladen und beim Erstbesuch gilt weiterhin der ausschließlich öffentliche Offline-Vertrag. Konto- und Sitzungswechsel, geänderte Einstellungen, Modul-Lebenszyklusänderungen und die Freigabe eines Anbieters verwerfen private Schnappschüsse. Serverseitige Sperren können ohne Verbindung nicht erkannt werden. Die Wiederherstellung prüft ungespeicherte Änderungen und lädt die Serverautorisierung neu.

## Commits

- [917330e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/917330ee4b13a580b92fbea30f0f56afeda7c65f)
- [945d22a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/945d22ac64936a5a63ba2d529efdc8a16587297d)
