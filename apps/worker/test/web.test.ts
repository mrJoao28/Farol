import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { createDemoServer } from '../../demo-site/server.js';

async function freePort(): Promise<number> {
  const server = createServer();
  const listening = once(server, 'listening');
  server.listen(0, '127.0.0.1');
  await listening;
  const address = server.address();
  assert(address && typeof address !== 'string');
  await new Promise<void>(resolve => server.close(() => resolve()));
  return address.port;
}

async function waitForWeb(url: string): Promise<void> {
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(url)).ok) return; } catch { /* server still compiling */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error('O painel não iniciou a tempo.');
}

test('panel runs demo, persists history and serves failure evidence', { timeout: 120_000 }, async () => {
  const demo = createDemoServer();
  const listening = once(demo, 'listening');
  demo.listen(4173, '127.0.0.1');
  await listening;
  const webPath = resolve('../web');
  const port = await freePort();
  const web = spawn(process.execPath, [resolve(webPath, '../../node_modules/next/dist/bin/next'), 'dev', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: webPath, env: { ...process.env, FAROL_ENABLE_LOCAL_RUNS: '1' }, stdio: 'ignore', detached: true,
  });
  const ids: string[] = [];
  let browser;
  try {
    const base = `http://127.0.0.1:${port}`;
    await waitForWeb(`${base}/runs`);
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${base}/runs`);
    await page.getByRole('button', { name: /Executar jornada saudável/ }).click();
    await page.waitForURL(/\/runs\/[0-9a-f-]{36}$/);
    ids.push(new URL(page.url()).pathname.split('/').at(-1)!);
    await page.getByText('Todas as etapas passaram').waitFor();

    await page.goto(`${base}/runs`);
    await page.getByRole('button', { name: /Simular falha no contato/ }).click();
    await page.waitForURL(/\/runs\/[0-9a-f-]{36}$/, { timeout: 45_000 });
    ids.push(new URL(page.url()).pathname.split('/').at(-1)!);
    await page.getByText('A jornada parou nesta etapa').waitFor();
    const screenshot = await page.request.get(`${base}/api/runs/${ids[1]}/screenshot`);
    assert.equal(screenshot.status(), 200);
    assert.equal((await screenshot.body())[0], 0x89);
    const trace = await page.request.get(`${base}/api/runs/${ids[1]}/trace`);
    assert.equal(trace.status(), 200);
    assert.equal((await trace.body())[0], 0x50); // ZIP
    await page.reload();
    await page.getByText('A jornada parou nesta etapa').waitFor();
    await page.goto(`${base}/runs`);
    assert.equal(await page.locator('.run-row').count(), 2);
  } finally {
    await browser?.close();
    if (web.pid) { try { process.kill(-web.pid, 'SIGTERM'); } catch { /* process already exited */ } }
    await new Promise<void>(resolve => demo.close(() => resolve()));
    await Promise.all(ids.map(id => rm(join('.farol/runs', id), { recursive: true, force: true })));
  }
});
