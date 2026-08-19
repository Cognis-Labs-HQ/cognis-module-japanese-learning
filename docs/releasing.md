# Releasing

Keep `package.json` and `manifest.json` versions synchronized. Preserve the module UUID permanently.

Before publishing, run `npm install`, `npm test`, `npm run manifest:hashes`, `npm run check:manifest`, and `git diff --check`. Commit the updated integrity inventory with every changed file.
