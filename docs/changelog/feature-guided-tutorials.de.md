# Geführtes Tutorial

**Feature Branch:** feature-guided-tutorials

## Technische Spezifikation

Explore- und Lernkarten-Routen werden über Studys öffentliche Capability `study:tutorialTargets` aufgelöst. Das Sprachmodul liefert nur Sprachdaten und Abläufe; Cognis bleibt für Routen, Einschreibungen, Cache und Lernoberfläche zuständig. Englisch und Japanisch verwenden dieselbe Anbieterimplementierung. Zwischengespeicherte Inhalte lassen sich offline erklären. Nach der Navigation fehlende Ziele folgen der Fehlzielrichtlinie des Hosts.

Das Modul registriert seinen Ablauf und übersetzte Texte über ctx. Der Host verwaltet Katalog, Hinweise, Pfeile, Hervorhebung, Tastatur- und Zeigersteuerung, geschützte SPA-Navigation und Barrierefreiheit. Schließen, fremde Navigation, Zugriffsverlust oder Deaktivierung beenden die Sitzung. Scheitert das Einhängen des Anbieters, werden seine Registrierungen zurückgenommen.

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.
