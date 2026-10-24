# Offline lernen

**Feature-Zweig:** feature-offline-study

## Offline-Modus

Study behält begrenzte, kleine JSON-Schnappschüsse im aktuellen Tab: Schemas, erlaubte Zeichen- und Kartendaten, Speicherorte, gesehene IDs, Favoriten und zuvor geöffnete Kartensätze. Sprachschemas aktivieren dies mit `metadata.offline: { cache: "lightweight" }`. Der Library-Cache umfasst höchstens 16 MB und 100 Lesevorgänge; andere Lesecaches höchstens 4 MB und 100 Lesevorgänge. Audiodaten, Wörterbuchantworten, Zugangsdaten und authentifizierte Dokumente werden nicht dauerhaft gespeichert.

Explore-Vorschauen verwenden bereits autorisierte Cache-Daten. Zeichnen und Lernkarten funktionieren lokal. Abschlüsse, Bewertungen, gesehene IDs und endgültige Favoritenzustände werden zur Übertragung vorgemerkt; Fortschritt, XP und Belohnungen sind erst nach Serverbestätigung verbindlich. Audio sowie Wörterbuch- und ElevenLabs-Abfragen stoppen. Bearbeiten, Löschen und Freigaben benötigen eine Verbindung. Nur zuvor geladene Inhalte innerhalb der Cache-Grenzen sind verfügbar.

Privates Study benötigt dieselbe zuvor bestätigte, noch gültige Kontositzung im selben Tab. Nach Neuladen und beim Erstbesuch gilt weiterhin der ausschließlich öffentliche Offline-Vertrag. Konto- und Sitzungswechsel, geänderte Einstellungen, Modul-Lebenszyklusänderungen und die Freigabe eines Anbieters verwerfen private Schnappschüsse. Serverseitige Sperren können ohne Verbindung nicht erkannt werden. Die Wiederherstellung prüft ungespeicherte Änderungen und lädt die Serverautorisierung neu.

## Übertragung und Zustimmung

Der Host stellt `offline:outbox`, `offline:state` und `offline:accessPolicy` über ctx bereit. Komponenten registrieren Übertragungshandler für ihre Anbieter-Lebensdauer und stabile IDs über `offline:enqueue`; `offline:flush` autorisiert und überträgt. Die dauerhafte kontogebundene Warteschlange umfasst höchstens 1.000 Einträge und 1 MB für sieben Tage, ohne Tokens. IDs und Zeitstempel bleiben erhalten; temporäre Fehler werden wiederholt, bestätigte oder dauerhaft abgelehnte Einträge entfernt. Eine lokalisierte Warnung meldet Ablehnungen. Abmelden leert die Konto-Warteschlange; andere Konten erhalten keine fremden Einträge. Deaktivieren stoppt neue Offline-Einträge. Vorhandene Einträge können online übertragen werden.

Die Wiederherstellung aktualisiert Anbieter und führt `authenticate-session` aus, bevor die abschließende Phase `afterSession` Aktivitäten überträgt. Erforderliche Anbieter deklarieren `offlineAccessGuard` im Serverkatalog. Unbekannte Anforderungen oder fehlende Zustimmung sperren Offline-Zugriff. Terms of Service speichert zuletzt abgerufene Dokumentversionen und serverbestätigte Zustimmung je Konto. Neue nicht akzeptierte Versionen sperren Offline-Lesen, Navigation und Einträge sofort sowie die Übertragung bis zur Online-Zustimmung. Offline-Zustimmung ist nicht möglich. Private Inhalte bleiben tablokal; nur begrenzte Warteschlangen und Rechtstexte überstehen Neuladen.

## Commits

- [917330e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/917330ee4b13a580b92fbea30f0f56afeda7c65f)
- [945d22a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/945d22ac64936a5a63ba2d529efdc8a16587297d)
- [6fabbaa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6fabbaaad6be1499e3ca8c5a3d3101b31166d2c4)
