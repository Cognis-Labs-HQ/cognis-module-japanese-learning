# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung erfasst JavaScript- und TypeScript-Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Sie prüft Laufzeitbindungen, Signaturparameter, private Mitglieder sowie eigene zusammengesetzte Typ- und Methodennamen. Übliche Kurzformen bleiben als direkte Namen wie `db`, `this.db`, `args` und LDAP-`dn` zulässig. Zusammengesetzte Namen schreiben ihre Wörter aus, auch bei übernommenen Bezeichnern: `DatabaseExecutor`, `KeyringDatabaseExecutor`, `createDatabaseExecutor`, `baseDistinguishedName` und `registerStaticDirectory`. Undurchsichtige Kurzformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Ein ungenutztes, nicht exportiertes `_`, `id` und arithmetische `i`/`j`/`k`-Zähler behalten ihre festgelegten Rollen. Generische Typparameter, kanonische Abhängigkeits- und Plattformnamen sowie öffentliche Nutzdatenschlüssel behalten ihre Verträge. Eigene API-Deklarationen, Importe, Exporte und Aufrufer verwenden denselben Namen; reine Umbenennungsaliase einschließlich Typaliasen schlagen fehl. Regressionstestfälle sichern die Unterscheidung direkter und zusammengesetzter Namen sowie kanonische Plattform-APIs. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert.

## Commits

- [d578e19](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d578e19927699ee1b980bb821c5ce97b67473cd3)
- [7807a07](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7807a07671caeee95c0d9c70c83f19736a70e602)
- [a484a61](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a484a610c4dab936af664038d8db3b5878e669b9)
- [c9c96c2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c9c96c2e99ea54769e706a673c0a2823ecdf7027)
