# Farol

**Saiba quando seu site para de funcionar para quem o usa.**

Farol é um projeto de monitoramento de jornadas em sites. A proposta é executar ações reais no navegador, identificar a etapa que falhou, guardar evidências e avisar quando um incidente for confirmado.

> Em planejamento: este repositório ainda não contém um produto funcional.

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

## Licença

[MIT](LICENSE).
