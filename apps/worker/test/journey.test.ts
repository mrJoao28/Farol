import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localBaseUrl, parseJourney } from '../src/journey.js';

test('accepts a declarative journey and strips unknown properties', () => {
  assert.deepEqual(parseJourney({ name: 'Contato', steps: [{ action: 'click', role: 'link', name: 'Contato', script: 'alert(1)' }] }), {
    name: 'Contato', steps: [{ action: 'click', role: 'link', name: 'Contato' }],
  });
});

test('rejects invalid steps and excess steps', () => {
  assert.throws(() => parseJourney({ name: 'X', steps: [{ action: 'eval', code: '1+1' }] }), /Etapa 1 inválida/);
  assert.throws(() => parseJourney({ name: 'X', steps: Array(11).fill({ action: 'open', path: '/' }) }), /entre 1 e 10/);
  assert.throws(() => parseJourney({ name: 'X', steps: [{ action: 'open', path: '//example.com' }] }), /Etapa 1 inválida/);
  assert.throws(() => parseJourney({ name: 'X', steps: [{ action: 'open', path: '/\\example.com' }] }), /Etapa 1 inválida/);
});

test('allows only a local HTTP base URL', () => {
  assert.equal(localBaseUrl('http://127.0.0.1:4173/').origin, 'http://127.0.0.1:4173');
  for (const url of ['https://example.com/', 'http://localhost:4173/', 'http://127.0.0.1:4173/path', 'http://user:pass@127.0.0.1/']) {
    assert.throws(() => localBaseUrl(url));
  }
});
