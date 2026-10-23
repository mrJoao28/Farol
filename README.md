# Farol

**Saiba quando seu site para de funcionar para quem o usa.**

Farol é um projeto de monitoramento de jornadas em sites. A proposta é executar ações reais no navegador, identificar a etapa que falhou, guardar evidências e avisar quando um incidente for confirmado.

> Em planejamento: este repositório ainda não contém um produto funcional.

O escopo, a arquitetura proposta, o backlog e os critérios de conclusão estão em [docs/MVP.md](docs/MVP.md).

## Primeira demonstração planejada

1. Cadastrar uma jornada: abrir a página inicial → clicar em “Contato” → verificar o formulário.
2. Executá-la manualmente e depois em intervalos.
3. Quebrar o botão na aplicação de demonstração.
4. Ver a etapa com falha, a captura de tela e um alerta após a confirmação do incidente.
5. Corrigir o botão e receber o aviso de recuperação.

## Direção técnica

TypeScript, Next.js, Playwright, PostgreSQL, Prisma, Redis/BullMQ e Docker Compose. A primeira versão será instalável pelo próprio desenvolvedor e ficará focada em sites sob seu controle. Decisões e limites estão detalhados no [plano do MVP](docs/MVP.md).

## Licença

[MIT](LICENSE).
