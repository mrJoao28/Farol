import type { Page } from 'playwright';

export type Step =
  | { action: 'open'; path: string }
  | { action: 'click'; role: 'link' | 'button'; name: string }
  | { action: 'visible'; role: 'heading' | 'link' | 'button'; name: string };

export type Journey = { name: string; steps: Step[] };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function label(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 120;
}

export function parseJourney(value: unknown): Journey {
  if (!record(value) || !label(value.name) || !Array.isArray(value.steps) || value.steps.length < 1 || value.steps.length > 10) {
    throw new Error('Jornada inválida: informe um nome e entre 1 e 10 etapas.');
  }
  const steps: Step[] = value.steps.map((step, index) => {
    if (!record(step)) throw new Error(`Etapa ${index + 1} inválida.`);
    if (step.action === 'open' && typeof step.path === 'string' && /^\/(?!\/)/.test(step.path) && !step.path.includes('\\')) {
      return { action: 'open', path: step.path };
    }
    if (step.action === 'click' && (step.role === 'link' || step.role === 'button') && label(step.name)) {
      return { action: 'click', role: step.role, name: step.name };
    }
    if (step.action === 'visible' && (step.role === 'heading' || step.role === 'link' || step.role === 'button') && label(step.name)) {
      return { action: 'visible', role: step.role, name: step.name };
    }
    throw new Error(`Etapa ${index + 1} inválida.`);
  });
  return { name: value.name, steps };
}

export function localBaseUrl(input: string): URL {
  const url = new URL(input);
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Nesta versão, a URL base deve ser http://127.0.0.1:<porta>/ sem credenciais.');
  }
  return url;
}

export async function executeStep(page: Page, origin: string, step: Step): Promise<void> {
  switch (step.action) {
    case 'open': {
      const target = new URL(step.path, origin);
      if (target.origin !== origin) throw new Error('A etapa não pode navegar para outra origem.');
      await page.goto(target.href, { waitUntil: 'domcontentloaded' });
      if (new URL(page.url()).origin !== origin) throw new Error('Redirecionamento para outra origem.');
      break;
    }
    case 'click':
      await page.getByRole(step.role, { name: step.name, exact: true }).click();
      break;
    case 'visible':
      await page.getByRole(step.role, { name: step.name, exact: true }).waitFor({ state: 'visible' });
      break;
  }
}
