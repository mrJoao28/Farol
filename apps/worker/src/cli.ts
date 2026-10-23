import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseJourney } from './journey.js';
import { runJourney } from './runner.js';

async function main() {
  const [file, baseUrl = 'http://127.0.0.1:4173/'] = process.argv.slice(2);
  if (!file) throw new Error('Uso: npm run journey -- <caminho-do-json> [http://127.0.0.1:4173/]');
  const journey = parseJourney(JSON.parse(await readFile(resolve(file), 'utf8')));
  const result = await runJourney(journey, baseUrl, resolve('.farol/runs'));
  console.log(JSON.stringify(result, null, 2));
  if (result.status === 'failed') process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});
