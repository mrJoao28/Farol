# Conectar repositórios com GitHub App

O Farol aceita projetos por URL e, opcionalmente, vincula um repositório escolhido na instalação de um GitHub App próprio. Esta integração está disponível **apenas no servidor de desenvolvimento local** enquanto não houver login administrativo e proteção de produção. O vínculo informa qual código pertence ao projeto; o site monitorado é sempre a URL do deploy digitada pelo usuário. Nesta etapa, cadastrar não inicia uma execução no deploy externo.

## Configurar o aplicativo

1. Em **GitHub → Settings → Developer settings → GitHub Apps**, registre um App próprio (por exemplo, `farol-local-joao`). Escolha a opção de instalação na conta desejada; na instalação, selecione somente os repositórios que quer disponibilizar no Farol.
2. Em **Repository permissions**, use apenas **Metadata: Read-only** (permissão base). Não habilite leitura/escrita de conteúdo e não configure eventos/webhooks para este fluxo de cadastro.
3. Configure **Setup URL** como `http://127.0.0.1:3000/api/github/callback` e mantenha a opção de redirecionar após atualização da instalação. Se seu ambiente exigir HTTPS público para o retorno, use um túnel HTTPS apontando para o servidor local e cadastre a URL `/api/github/callback` desse túnel. O callback e o botão de instalação precisam abrir no mesmo navegador para validar o estado da solicitação.
4. Copie `apps/web/.env.example` para `apps/web/.env.local`. Preencha `GITHUB_APP_ID` (ID numérico), `GITHUB_APP_SLUG` (parte do endereço `/apps/SLUG`) e `GITHUB_APP_PRIVATE_KEY_PATH` (caminho para a chave PEM gerada no GitHub, relativo a `apps/web`). Salve o PEM em `.secrets/farol.pem` na raiz do repositório, que está ignorada pelo Git. Nunca registre a chave no repositório.
5. Reinicie `npm run dev`, abra `http://127.0.0.1:3000/projects/new`, clique em **Conectar GitHub App** e instale/atualize o acesso aos repositórios. Selecione um repositório na lista, informe **separadamente** a origem HTTPS do deploy e salve o projeto.

O fluxo armazena no disco apenas o ID da instalação, a conta, o ID/nome do repositório e a URL informada. O token da instalação é obtido temporariamente para cada consulta e não é salvo. Antes de criar um vínculo e ao abrir o projeto, o Farol consulta a instalação atual; repositórios removidos deixam de ser selecionáveis e são sinalizados como sem acesso no detalhe.

O retorno da instalação verifica um token de estado temporário guardado em cookie e consulta o GitHub para conferir o ID do App e o estado da instalação. Isso protege o fluxo local contra retornos casuais ou forjados. Para uma versão multiusuário pública, ainda será necessário associar a instalação à identidade do usuário via autorização GitHub e proteger a sessão administrativa; por isso o recurso está desativado fora do desenvolvimento local.

Projetos por URL não exigem GitHub App. O catálogo fica em `apps/web/.farol/projects/` e a instalação em `apps/web/.farol/github-installation.json`. Não há banco de dados nem sincronização entre máquinas nesta etapa.
