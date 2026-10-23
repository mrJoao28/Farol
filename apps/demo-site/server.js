import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

export function createDemoServer() {
  return createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const broken = url.searchParams.get('broken') === '1';
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');

    if (url.pathname === '/contact') {
      response.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Contato — Farol Demo</title><main><h1>Fale com a equipe</h1><p>Formulário de contato disponível.</p></main></html>`);
      return;
    }

    if (url.pathname !== '/') {
      response.statusCode = 404;
      response.end('<h1>Página não encontrada</h1>');
      return;
    }

    response.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Farol Demo</title><main><h1>Seu site está no ar</h1><p>Uma jornada de usuário precisa ir além desta página.</p>${broken ? '<span>Contato indisponível</span>' : '<a href="/contact">Contato</a>'}</main></html>`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.DEMO_PORT ?? 4173);
  createDemoServer().listen(port, '127.0.0.1', () => {
    console.log(`Farol demo: http://127.0.0.1:${port}`);
  });
}
