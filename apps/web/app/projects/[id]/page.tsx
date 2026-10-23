import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { getProject } from "@/lib/projects";
import { listInstallationRepositories, readInstallation } from "@/lib/github-app";
import { localRunsEnabled } from "@/lib/runs";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = localRunsEnabled() ? await getProject(id) : null;
  if (!project) notFound();
  let access: "verified" | "lost" | "none" = project.repository ? "lost" : "none";
  if (project.repository) {
    try {
      const installation = await readInstallation();
      const repositories = installation?.id === project.repository.installationId ? await listInstallationRepositories(installation) : [];
      if (repositories.some(repo => repo.id === project.repository?.id)) access = "verified";
    } catch { /* revoked or unavailable */ }
  }
  return <Shell section="projects">
    <Link href="/projects" className="back-link">← Voltar aos projetos</Link>
    <div className="detail-heading"><div><p className="overline">PROJETO / {project.environment === "production" ? "PRODUÇÃO" : "HOMOLOGAÇÃO"}</p><h1>{project.name}<span>.</span></h1><p className="supporting-copy">Cadastro salvo nesta instalação.</p></div><span className="incident-id">{project.id.slice(0, 8).toUpperCase()}</span></div>
    <div className="detail-panel project-detail"><p className="small-caps">ORIGEM MONITORÁVEL</p><a href={project.deployUrl} target="_blank" rel="noreferrer">{project.deployUrl} ↗</a><p className="form-help">Esta URL foi cadastrada, mas nenhuma verificação externa foi executada.</p>
      <p className="small-caps">REPOSITÓRIO</p>{project.repository ? <p><a href={project.repository.htmlUrl} target="_blank" rel="noreferrer">{project.repository.fullName} ↗</a><span className={access === "verified" ? "access-ok" : "access-lost"}>{access === "verified" ? "Acesso autorizado" : "Acesso removido ou indisponível"}</span></p> : <p>Adicionado por URL, sem repositório vinculado.</p>}
    </div>
    <div className="detail-next"><span>PRÓXIMO PASSO</span><p>Configurar uma jornada e executar no deploy público depois que o worker aplicar o bloqueio de endereços privados e redirecionamentos.</p></div>
  </Shell>;
}
