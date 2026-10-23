import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { chromium } from 'playwright';
import { executeStep, localBaseUrl, type Journey } from './journey.js';

export type StepResult = { index: number; action: string; status: 'passed' | 'failed'; durationMs: number; error?: string };
export type RunResult = { id: string; journey: string; status: 'passed' | 'failed'; startedAt: string; durationMs: number; steps: StepResult[]; screenshot?: string; trace?: string };

export async function runJourney(journey: Journey, url: string, outputDirectory: string): Promise<RunResult> {
  const base = localBaseUrl(url);
  const id = randomUUID();
  const startedAt = new Date().toISOString();
  const start = Date.now();
  const folder = join(outputDirectory, id);
  const result: RunResult = { id, journey: journey.name, status: 'passed', startedAt, durationMs: 0, steps: [] };
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const deadline = setTimeout(() => { void browser.close(); }, 60_000);
  try {
    context.setDefaultTimeout(10_000);
    context.setDefaultNavigationTimeout(10_000);
    await context.route('**/*', route => {
      try {
        const target = new URL(route.request().url());
        if (target.origin === base.origin) return route.continue();
      } catch { /* malformed request */ }
      return route.abort();
    });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    for (const [index, step] of journey.steps.entries()) {
      const stepStart = Date.now();
      try {
        await executeStep(page, base.origin, step);
        result.steps.push({ index: index + 1, action: step.action, status: 'passed', durationMs: Date.now() - stepStart });
      } catch (error) {
        result.status = 'failed';
        result.steps.push({ index: index + 1, action: step.action, status: 'failed', durationMs: Date.now() - stepStart, error: error instanceof Error ? error.message : String(error) });
        await mkdir(folder, { recursive: true });
        const screenshot = join(folder, 'failure.png');
        const trace = join(folder, 'trace.zip');
        try { await page.screenshot({ path: screenshot, timeout: 3000 }); result.screenshot = screenshot; } catch { /* browser may have closed */ }
        try { await context.tracing.stop({ path: trace }); result.trace = trace; } catch { /* browser may have closed */ }
        break;
      }
    }
    if (result.status === 'passed') await context.tracing.stop();
  } finally {
    clearTimeout(deadline);
    result.durationMs = Date.now() - start;
    await browser.close();
    if (result.status === 'passed') await rm(folder, { recursive: true, force: true });
  }
  return result;
}
