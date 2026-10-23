# Desenvolvimento local

## Requisitos

- Node.js 22 ou superior, com npm.
- Navegador recente para visualizar as telas.

## Executar

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. A página inicial mostra uma prévia do painel Vigia; o diagnóstico ilustrativo está em `/incidents/demo`.

## Verificar

```bash
npm run lint
npm run typecheck
npm run build
```

Esses comandos também rodam na CI para cada pull request. O workspace `apps/web` usa Next.js App Router. Os arquivos em `brand/` são as fontes da identidade; as cópias em `apps/web/public/brand/` e `apps/web/app/icon.svg` servem o navegador e devem ser atualizadas quando a marca mudar.

## Estado desta entrega

**A interface usa dados demonstrativos.** Ainda não existe login, integração GitHub, banco de dados, worker Playwright, agendamento ou alertas. Um estado exibido na prévia não representa monitoramento real do site citado. Consulte [o plano do MVP](MVP.md) para os próximos componentes.
