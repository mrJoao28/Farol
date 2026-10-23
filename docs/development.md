# Desenvolvimento local

## Requisitos

- Node.js 22 ou superior, com npm.
- Chromium do Playwright (`npx playwright install chromium --only-shell`) para executar jornadas.

## Executar

```bash
npm ci
npm run dev
```

Abra `http://127.0.0.1:3000`. A página inicial mostra projetos ilustrativos; o diagnóstico ilustrativo está em `/incidents/demo`.

Para a jornada real, copie `apps/web/.env.example` para `apps/web/.env.local`, inicie `npm run demo` em outro terminal e reinicie `npm run dev`. Abra `/runs` para executar os dois cenários, ver o histórico e consultar a captura/trace. O servidor de desenvolvimento está vinculado a `127.0.0.1` e a execução manual exige `FAROL_ENABLE_LOCAL_RUNS=1`; a interface de execução não é habilitada em produção.

O catálogo de projetos em `/projects` usa a mesma flag de desenvolvimento. O fluxo por URL não precisa de credenciais; para vincular repositórios, configure o [GitHub App](github-integration.md).

## Verificar

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

Esses comandos também rodam na CI para cada pull request. O workspace `apps/web` usa Next.js App Router. Os arquivos em `brand/` são as fontes da identidade; as cópias em `apps/web/public/brand/` e `apps/web/app/icon.svg` servem o navegador e devem ser atualizadas quando a marca mudar.

## Estado desta entrega

**Os projetos da visão geral usam dados ilustrativos.** O catálogo em `/projects` guarda nome, URL e vínculo opcional com GitHub App no disco local. O worker Playwright executa somente a demo, grava `result.json` para cada execução e registra screenshot/trace em falha. O histórico fica em `apps/worker/.farol/runs/`, sem retenção automática ou banco. Ainda não existem login, execução de jornadas em URLs externas, agendamento e alertas. Consulte [o plano do MVP](MVP.md) para os próximos componentes.
