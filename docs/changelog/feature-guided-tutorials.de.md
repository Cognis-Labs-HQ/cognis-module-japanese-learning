# Geführtes Tutorial

**Feature Branch:** feature-guided-tutorials

## Technische Spezifikation

Explore- und Lernkarten-Routen werden über Studys öffentliche Capability `study:tutorialTargets` aufgelöst. Das Sprachmodul liefert nur Sprachdaten und Abläufe; Cognis bleibt für Routen, Einschreibungen, Cache und Lernoberfläche zuständig. Englisch und Japanisch verwenden dieselbe Anbieterimplementierung. Zwischengespeicherte Inhalte lassen sich offline erklären. Nach der Navigation fehlende Ziele folgen der Fehlzielrichtlinie des Hosts.

Das Modul registriert seinen Ablauf und übersetzte Texte über ctx. Der Host verwaltet Katalog, Hinweise, Pfeile, Hervorhebung, Tastatur- und Zeigersteuerung, geschützte SPA-Navigation und Barrierefreiheit. Schließen, fremde Navigation, Zugriffsverlust oder Deaktivierung beenden die Sitzung. Scheitert das Einhängen des Anbieters, werden seine Registrierungen zurückgenommen.

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

## Seitengebundener Erstbesuch

Der Host verwaltet Hinweise, Pfeile, Hervorhebung, Barrierefreiheit und das gemeinsame schwebende Aktionsmenü. Erstdurchläufe bieten stets Weiter, ohne Abbrechen oder Überspringen. Wiederholungen bieten Abbrechen mit `btn-cancel`. Der Abschluss wird im Browser pro Konto gespeichert. Navigation, Zugriffsverlust und Anbieterentfernung beenden die Sitzung; fehlgeschlagenes Mounten nimmt Registrierungen zurück.

## Übersetzungsschlüssel

Die Übersetzungsschlüssel der Anleitung verwenden die vollständige Modul-ID des Manifests einschließlich Bindestrichen als ein Namensraumsegment.

## Konkrete Anleitungstexte

Die Schritte beschreiben verfügbare Bedienelemente und Aufgaben, ohne sachfremde Zusicherungen über Berechtigungen oder nicht ausgeführte Aktionen.

## Weiter-Hinweise pro Schritt festlegen

Jeder Tutorial-Schritt legt `highlightNext` ausdrücklich fest: Erklärungen, die Weiter oder Fertig benötigen, aktivieren den Hinweis; interaktive und wartebasierte Übungen deaktivieren ihn. Bei reduzierter Bewegung bleibt eine statische Umrandung.

Alle UI-Komponenten benötigen eine Anleitung. Die Beitragsrichtlinien verlangen nutzerorientierte Aufgabenabläufe und eine Prüfung bestehender Anleitungen bei neuen Funktionen oder geänderter Bedienung.

## Sichtbare Tutorial-Ziele

Tutorial-Ziele und Weiter-Hinweise sind ausdrücklich festgelegt.

## Gemeinsame Menüwarteschlange

Menüs folgen der gemeinsamen Host-Warteschlange und der Komponentenlebensdauer.

## Dokumentierte Wiederherstellungsaktionen

Bei fehlenden Zielen stehen Weiter und Tutorial neu starten bereit; Wiederholungen bieten auch Abbrechen.

## Gezielte Tutorialführung

Anleitungen erklären unterschiedliche sichtbare Bedienelemente in UI-Reihenfolge. Die gemeinsamen Vorgaben behandeln aktive Ansichten, stabile Beispiele, Leerzustände, bedingte Zweige und Lebensdauerbereinigung. Wiederholungsaktionen und Dokumentation zu reduzierter Bewegung entsprechen dem gemeinsamen Host.

## Gezielte Anleitung

Sprachanleitungen stehen erst nach ausdrücklicher Einschreibung in den Study-Einstellungen bereit. Die überflüssige Einschreibungseinführung entfällt; die Anleitung beginnt mit Erkunden und führt zu Übungswerkzeugen.

## Commits

- [9eb04a5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9eb04a52924608bec3a943121d169c9b09e5a59d)
- [6429024](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64290246cd5ef8567402e71e22921a3e28f36d76)
- [e6768d1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e6768d18e5e9e78eb456e25ce2c8d935214683b8)
- [8696a30](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8696a3069f18388c39b7c13bd2ea59f569c25a85)
- [8946fb9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8946fb98097d13ebd923e1c2354d13ef1e0545c3)
- [0c2bcf9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0c2bcf9e65dc2bf8c27b533d77b9456d73985070)
- [646a16c12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/646a16c12d8bfa98ca71b09a074fa70d505851e5)
- [028167419](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/028167419f103c6d3b2bb9df4ff25a47f3e06080)
