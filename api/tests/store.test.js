import assert from 'node:assert/strict';
import { mkdtemp, cp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { LanguageLibraryStore } from '../store.js';

test('loads and queries the extracted Japanese library', async () => {
  const moduleRoot = await mkdtemp(path.join(os.tmpdir(), 'cognis-ja-'));
  await cp(path.resolve('data'), path.join(moduleRoot, 'data'), {
    recursive: true,
  });
  try {
    const store = new LanguageLibraryStore({
      moduleRoot,
      languageCode: 'ja',
      altCharactersFileName: 'kanji',
    });
    await store.initialise();
    const hiragana = store.queryLayer('characters', {
      characterClass: 'hiragana',
    });
    assert.ok(hiragana.length > 40);
    assert.deepEqual(hiragana[0], {
      id: 'ja:char:a',
      symbol: 'あ',
      romanization: 'a',
      characterClass: 'hiragana',
    });
    assert.ok(store.snapshot().definitions.length > 0);
  } finally {
    await rm(moduleRoot, { recursive: true, force: true });
  }
});

test('returns defensive copies of library records', async () => {
  const store = new LanguageLibraryStore({
    moduleRoot: path.resolve('.'),
    languageCode: 'ja',
    altCharactersFileName: 'kanji',
  });
  await store.initialise();
  const records = store.queryLayer('characters', {
    characterClass: 'hiragana',
  });
  records[0].symbol = 'changed';
  assert.equal(
    store.queryLayer('characters', { characterClass: 'hiragana' })[0].symbol,
    'あ',
  );
});
