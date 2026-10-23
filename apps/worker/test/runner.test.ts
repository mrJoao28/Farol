import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { test } from 'node:test';
import { createDemoServer } from '../../demo-site/server.js';
import { parseJourney } from '../src/journey.js';
import { runJourney } from '../src/runner.js';

test('healthy and broken demo record the exact failing step and evidence', async () => {
  const server = createDemoServer();
  const listening = once(server, 'listening');
  server.listen(0, '127.0.0.1');
  const folder = await mkdtemp(join(tmpdir(), 'farol-runner-'));
  try {
    await listening;
    const address = server.address();
    assert(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}/`;
    const steps = [
      { action: 'open', path: '/' },
      { action: 'click', role: 'link', name: 'Contato' },
      { action: 'visible', role: 'heading', name: 'Fale com a equipe' },
    ];
    const healthy = await runJourney(parseJourney({ name: 'Saudável', steps }), base, folder);
    assert.equal(healthy.status, 'passed');
    assert.equal(healthy.steps.length, 3);
    assert.equal(healthy.screenshot, undefined);

    const broken = await runJourney(parseJourney({ name: 'Quebrada', steps: [{ action: 'open', path: '/?broken=1' }, ...steps.slice(1)] }), base, folder);
    assert.equal(broken.status, 'failed');
    assert.deepEqual(broken.steps.map(step => step.status), ['passed', 'failed']);
    assert.equal(broken.steps[1].index, 2);
    assert.match(broken.steps[1].error ?? '', /Contato/);
    assert(broken.screenshot && broken.trace);
    assert((await stat(broken.screenshot)).size > 0);
    assert((await stat(broken.trace)).size > 0);
    assert.equal((await readFile(broken.screenshot))[0], 0x89); // PNG
  } finally {
    server.close();
    await rm(folder, { recursive: true, force: true });
  }
});
