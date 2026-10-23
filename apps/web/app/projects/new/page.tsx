import Link from "next/link";
import { Shell } from "@/components/shell";
import { appConfig, listInstallationRepositories, readInstallation } from "@/lib/github-app";
import { localRunsEnabled } from "@/lib/runs";
import type { RepositoryLink } from "@/lib/projects";
import { addProject } from "./actions";

export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  disabled: "O cadastro só funciona na instalação local de desenvolvimento.",
  fields: "Informe nome, ambiente e origem HTTPS pública válida, sem caminho ou parâmetros.",
  github: "O repositório não está mais autorizado. Atualize a instalação do GitHub App e tente novamente.",
  storage: "Não foi possível salvar o projeto no disco local.",
  "github-state": "A conexão com o GitHub expirou ou o retorno não corresponde à solicitação. Inicie novamente.",
  "github-installation": "Não foi possível verificar a instalação do GitHub App.",
};

export default async function NewProject({ searchParams }: { searchParams: Promise<{ error?: string; connected?: string }> }) {
  const query = await searchParams;
  const enabled = localRunsEnabled();
  const config = appConfig();
  const installation = enabled && config ? await readInstallation() : null;
  let repositories: RepositoryLink[] = [];
  let connectionFailed = false;
  if (installation) {
    try { repositories = await listInstallationRepositories(installation); }
    catch { connectionFailed = true; }
  }
  return <Shell section="projects">
    <Link href="/projects" className="back-link">← Voltar aos projetos</Link>
    <p className="overline">NOVO PROJETO / 01</p><h1>Adicionar projeto<span>.</span></h1>
    <p className="supporting-copy">Selecione um repositório autorizado, informe a URL do site publicado e confirme o ambiente.</p>
    {!enabled && <div className="preview-note" role="status"><span>DESATIVADO</span> Habilite FAROL_ENABLE_LOCAL_RUNS=1 no servidor de desenvolvimento.</div>}
    {query.error && messages[query.error] && <div className="run-alert" role="alert">{messages[query.error]}</div>}
    {query.connected && !connectionFailed && <div className="preview-note" role="status"><span>CONECTADO</span> Instalação verificada. Escolha um repositório autorizado.</div>}
    {enabled && <div className="project-form-grid"><section className="detail-panel">
      <p className="small-caps">01 / REPOSITÓRIO</p>
      <p className="form-help">{!config ? "Configure o GitHub App para importar repositórios, ou prossiga apenas com a URL." : connectionFailed ? "A instalação foi removida ou está indisponível. Conecte novamente." : installation ? `Instalado em ${installation.account}. ${repositories.length} repositórios autorizados.` : "Instale o GitHub App escolhendo os repositórios que o Farol poderá listar."}</p>
      {config && <a className="outlined-action" href="/api/github/install">{installation ? "Atualizar acesso no GitHub" : "Conectar GitHub App"} ↗</a>}
      <form action={addProject} className="project-form">
        <label htmlFor="repositoryId">Repositório</label>
        <select name="repositoryId" id="repositoryId" defaultValue="none"><option value="none">Sem repositório · adicionar por URL</option>{repositories.map(repo => <option value={repo.id} key={repo.id}>{repo.fullName}</option>)}</select>
        <label htmlFor="name">Nome do projeto</label><input id="name" name="name" maxLength={80} required placeholder="Meu site" />
        <label htmlFor="deployUrl">URL pública do deploy</label><input id="deployUrl" name="deployUrl" type="url" required placeholder="https://meusite.com" />
        <p className="form-help">A URL do GitHub identifica o código. Informe separadamente a origem HTTPS onde o site está publicado.</p>
        <label htmlFor="environment">Ambiente</label><select id="environment" name="environment" defaultValue="production"><option value="production">Produção</option><option value="staging">Homologação</option></select>
        <button type="submit" className="solid-action">Salvar projeto ↗</button>
      </form>
    </section><aside className="evidence-panel"><div className="evidence-top"><span>COMO FUNCIONA</span><span>PROJETO / 01</span></div><div className="evidence-center"><span aria-hidden="true">⌁</span><h2>Seu repositório e seu site têm papéis diferentes.</h2><p>O Farol usa o GitHub App para descobrir o repositório selecionado. A URL informada aponta para o deploy que será monitorado quando a execução externa estiver pronta.</p></div></aside></div>}
  </Shell>;
}
