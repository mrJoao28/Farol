# Jornadas locais

Esta entrega contém um runner de linha de comando, uma demo HTTP e um histórico local no painel. Ainda não existe banco de dados, editor de jornadas, agendamento ou monitoramento de um deploy externo. Por enquanto a URL base é restrita a `http://127.0.0.1:<porta>/`. Não use o runner como serviço para URLs não confiáveis: isolamento de rede e proteção contra DNS rebinding são trabalho posterior do MVP.

## Rodar

Requisitos: Node.js 20.9+, `npm ci` e `npx playwright install chromium --only-shell` (no Linux, pode ser necessário `--with-deps`). Em terminais separados, a partir da raiz:

```bash
npm run demo
npm run journey -- examples/contact.json
npm run journey -- examples/contact-broken.json
```

O comando `journey` roda no workspace `apps/worker`, então os caminhos dos exemplos são relativos a ele. É possível passar uma URL base local diferente como segundo argumento: `npm run journey -- examples/contact.json http://127.0.0.1:4174/`. A demo usa a porta 4173, configurável por `DEMO_PORT`.

`contact.json` termina com código 0 e todas as etapas aprovadas. `contact-broken.json` termina com código 1 e falha ao clicar no link ausente. Um erro de configuração ou inicialização termina com código 2. A saída JSON inclui ID, horário, duração, estado, etapas e erro. Cada execução grava `apps/worker/.farol/runs/<id>/result.json` com a definição usada. Na falha, a mesma pasta contém `failure.png` e `trace.zip` quando a captura é possível. O trace pode ser aberto com `npx playwright show-trace <caminho-do-trace>`. Essas evidências ficam apenas no disco local e não têm retenção automática; podem conter conteúdo do site.

Para usar a interface, copie `apps/web/.env.example` para `apps/web/.env.local`, inicie `npm run demo` e `npm run dev` em terminais separados e abra `http://127.0.0.1:3000/runs`. A página lê as 50 execuções mais recentes desse diretório. O recurso fica desativado fora do ambiente de desenvolvimento.

## Formato

```json
{
  "name": "Abrir contato",
  "steps": [
    { "action": "open", "path": "/" },
    { "action": "click", "role": "link", "name": "Contato" },
    { "action": "visible", "role": "heading", "name": "Fale com a equipe" }
  ]
}
```

O caminho de `open` deve começar com uma única `/` e permanecer na origem base. `click` aceita `link` ou `button`; `visible` aceita também `heading`. O nome acessível deve corresponder exatamente ao texto informado. Cada jornada tem de 1 a 10 etapas; cada ação/navegação tem timeout de 10 segundos e a execução tenta encerrar após 60 segundos. A navegação é limitada à origem da demo, inclusive para recursos solicitados pela página. Não há JavaScript arbitrário, preenchimento de formulários nem credenciais nesta fatia.

Para verificar: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test`. Os testes de integração abrem Chromium, exercitam os dois estados da demo e verificam a execução pelo painel com histórico/evidências; no CI, o browser e suas dependências são instalados antes dos testes.
