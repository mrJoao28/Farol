import Link from "next/link";
import { Shell } from "@/components/shell";
import { projects } from "@/lib/demo";

export default function Overview() {
  const healthy = projects.filter((project) => project.status === "healthy").length;
  const incidents = projects.length - healthy;
  const journeys = projects.reduce((total, project) => total + project.journeys, 0);

  return (
    <Shell section="overview">
      <div className="preview-note" role="status">
        <span>PRÉVIA</span> Os projetos desta visão geral são ilustrativos. <Link href="/projects">Veja os projetos cadastrados ↗</Link> ou <Link href="/runs">as execuções reais da demo ↗</Link>
      </div>

      <section className="overview-head">
        <div>
          <p className="overline">ESTADO DA OPERAÇÃO</p>
          <h1>Estamos de olho<span>.</span></h1>
          <p className="supporting-copy">{projects.length} projetos. {journeys} jornadas. {incidents} problema para resolver.</p>
        </div>
        <Link className="outlined-action" href="/runs">Executar demo <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="incident-focus" aria-labelledby="featured-incident">
        <div className="incident-story">
          <div className="story-strip"><span>● &nbsp; INCIDENTE DEMONSTRATIVO</span><span>ETAPA 03 / 04</span></div>
          <div className="story-content">
            <p className="small-caps">JDM ENGENHARIA / SOLICITAR ORÇAMENTO</p>
            <h2 id="featured-incident">Falhou na etapa<br />que mais importa.</h2>
            <p>O formulário não apareceu após o clique. Veja como o diagnóstico será apresentado no Farol.</p>
            <Link href="/incidents/demo" className="solid-action">Abrir diagnóstico <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="steps-preview" aria-label="Etapas da jornada demonstrativa">
          <div className="steps-title">JORNADA DE EXEMPLO <span>03 / 04</span></div>
          <div className="step"><span>01</span><span>Abrir página</span><strong className="pass" aria-label="Concluída">✓</strong></div>
          <div className="step"><span>02</span><span>Clicar em orçamento</span><strong className="pass" aria-label="Concluída">✓</strong></div>
          <div className="step fail"><span>03</span><span>Encontrar formulário</span><strong aria-label="Falhou">×</strong></div>
          <div className="step pending"><span>04</span><span>Validar campos</span><strong aria-label="Não executada">—</strong></div>
          <Link href="/incidents/demo" className="steps-link">Entender a falha <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section id="projects" className="projects-section" aria-labelledby="projects-heading">
        <div className="section-title"><h2 id="projects-heading">PROJETOS NA DEMONSTRAÇÃO</h2><span>{String(projects.length).padStart(2, "0")} REGISTROS</span></div>
        <div className="project-list">
          {projects.map((project, index) => (
            <div className="project-row" key={project.repository}>
              <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="project-name"><strong>{project.name}</strong><small>{project.repository}</small></div>
              <span className="journey-count">{project.journeys} jornadas</span>
              <span className={project.status === "incident" ? "project-state failed" : "project-state healthy"}>
                <span aria-hidden="true">●</span> {project.status === "incident" ? "FALHA" : "ATIVO"}
              </span>
              <span className="checked-at">{project.checkedAt}</span>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
