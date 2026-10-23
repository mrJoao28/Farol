import Link from "next/link";
import { Shell } from "@/components/shell";
import { listProjects } from "@/lib/projects";
import { localRunsEnabled } from "@/lib/runs";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const enabled = localRunsEnabled();
  const projects = enabled ? await listProjects() : [];
  return <Shell section="projects">
    <div className="overview-head"><div><p className="overline">CATÁLOGO LOCAL</p><h1>Seus projetos<span>.</span></h1><p className="supporting-copy">Registre a URL publicada e, se desejar, vincule um repositório autorizado no GitHub.</p></div>
      {enabled && <Link href="/projects/new" className="solid-action">Adicionar projeto ↗</Link>}
    </div>
    {!enabled && <div className="preview-note" role="status"><span>DESATIVADO</span> O cadastro local exige FAROL_ENABLE_LOCAL_RUNS=1 no servidor de desenvolvimento.</div>}
    <section className="projects-section" aria-labelledby="catalog-heading"><div className="section-title"><h2 id="catalog-heading">PROJETOS CADASTRADOS</h2><span>{String(projects.length).padStart(2, "0")} REGISTROS</span></div>
      {projects.length === 0 ? <p className="run-empty">Nenhum projeto cadastrado nesta instalação.</p> : <div className="run-list">{projects.map(project =>
        <Link href={`/projects/${project.id}`} className="project-catalog-row" key={project.id}><strong>{project.name}</strong><span>{project.repository?.fullName ?? "Adicionado por URL"}</span><span className="project-state">AGUARDANDO JORNADA</span><span aria-hidden="true">↗</span></Link>
      )}</div>}
    </section>
    <div className="detail-next"><span>ESTADO ATUAL</span><p>O cadastro guarda os dados do projeto. Executar uma jornada nesse site será habilitado após o isolamento de URLs externas no worker.</p></div>
  </Shell>;
}
