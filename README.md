# Farol

**Saiba quando seu site para de funcionar para quem o usa.**

Farol é um projeto de monitoramento de jornadas em sites. A proposta é executar ações reais no navegador, identificar a etapa que falhou, guardar evidências e avisar quando um incidente for confirmado.

> Em desenvolvimento: a interface Vigia usa projetos ilustrativos. A aba **Execuções locais** executa jornadas reais na demo e mostra histórico e evidências; ainda não há agendamento nem projetos externos.

## Executar a interface

```bash
npm ci
npm run dev
```

Abra `http://127.0.0.1:3000`. Consulte [o guia de desenvolvimento](docs/development.md) para verificações e limitações da entrega atual.

Para executar jornadas pelo painel, instale o Chromium, copie `apps/web/.env.example` para `apps/web/.env.local`, inicie `npm run demo` e `npm run dev` em terminais separados e abra `/runs`. Os botões executam o caso saudável ou a falha no link de contato. O resultado e a captura ficam disponíveis após recarregar a página. Essa opção só funciona no servidor de desenvolvimento local.

## Executar a primeira jornada

Instale o Chromium uma vez com `npx playwright install chromium --only-shell`. Em um terminal, execute `npm run demo`. Em outro:

```bash
npm run journey -- examples/contact.json
npm run journey -- examples/contact-broken.json
```

O segundo comando termina com código `1` de propósito e registra a falha da etapa **clicar em Contato**, com screenshot e trace em `apps/worker/.farol/runs/`. Ambas as execuções gravam `result.json` e aparecem no histórico do painel local quando habilitado. Consulte [jornadas e evidências](docs/journeys.md) para a DSL, limites e reprodução.

O escopo, a arquitetura proposta, o backlog e os critérios de conclusão estão em [docs/MVP.md](docs/MVP.md).

## Primeira demonstração planejada

1. Conectar o GitHub, selecionar um repositório e informar a URL do site publicado (ou adicionar um site diretamente pela URL).
2. Cadastrar uma jornada: abrir a página inicial → clicar em “Contato” → verificar o formulário.
3. Executá-la manualmente e depois em intervalos.
4. Quebrar o botão na aplicação de demonstração.
5. Ver a etapa com falha, a captura de tela e um alerta após a confirmação do incidente.
6. Corrigir o botão e receber o aviso de recuperação.

## Direção técnica

GitHub App para importar repositórios autorizados; TypeScript, Next.js, Playwright, PostgreSQL, Prisma, Redis/BullMQ e Docker Compose. Farol não faz deploy: ele monitora a URL pública informada para o projeto. A primeira versão será instalável pelo próprio desenvolvedor e ficará focada em sites sob seu controle. Decisões e limites estão detalhados no [plano do MVP](docs/MVP.md).

## Identidade visual

A direção visual escolhida é **Vigia**: verde-escuro, creme e sinal âmbar, com foco no diagnóstico. O símbolo, a assinatura, o ícone e a arte de abertura estão em [brand/](brand/).

## Licença

[MIT](LICENSE).
