import Link from "next/link";
import { Shell } from "@/components/shell";
import { formatRunDate, listRuns, localRunsEnabled } from "@/lib/runs";
import { runDemo } from "./actions";

export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  demo: "Inicie a demo com npm run demo antes de executar a jornada.",
  runner: "O runner não conseguiu concluir. Verifique o Chromium e o terminal do servidor.",
  busy: "Já existe uma execução em andamento. Aguarde e tente novamente.",
  invalid: "Escolha uma das jornadas de demonstração.",
  disabled: "A execução local está desativada.",
};

export default async function RunsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const enabled = localRunsEnabled();
  const runs = await listRuns();

  return (
    <Shell section="runs">
      <p className="overline">DEMONSTRAÇÃO LOCAL / PLAYWRIGHT</p>
      <div className="overview-head"><div><h1>Execuções<span>.</span></h1><p className="supporting-copy">Rode a jornada de contato e compare o estado saudável com uma falha reproduzível.</p></div></div>
      {!enabled && <div className="preview-note" role="status"><span>DESATIVADO</span> Habilite FAROL_ENABLE_LOCAL_RUNS=1 no ambiente de desenvolvimento para executar e consultar o histórico local.</div>}
      {error && messages[error] && <div className="run-alert" role="alert">{messages[error]}</div>}
      {enabled && <div className="run-actions">
        <form action={runDemo}><input type="hidden" name="variant" value="healthy" /><button type="submit" className="solid-action">Executar jornada saudável ↗</button></form>
        <form action={runDemo}><input type="hidden" name="variant" value="broken" /><button type="submit" className="outlined-action">Simular falha no contato ↗</button></form>
      </div>}
      <section className="projects-section" aria-labelledby="history-heading">
        <div className="section-title"><h2 id="history-heading">HISTÓRICO LOCAL</h2><span>{String(runs.length).padStart(2, "0")} EXECUÇÕES RECENTES</span></div>
        {runs.length === 0 ? <p className="run-empty">Nenhuma jornada executada nesta instalação.</p> : <div className="run-list">
          {runs.map(run => <Link className="run-row" href={`/runs/${run.id}`} key={run.id}>
            <span className={run.status === "failed" ? "project-state failed" : "project-state healthy"}>{run.status === "failed" ? "● FALHOU" : "● SAUDÁVEL"}</span>
            <strong>{run.journey}</strong><span>{formatRunDate(run.startedAt)}</span><span>{(run.durationMs / 1000).toFixed(1)} s</span><span aria-hidden="true">↗</span>
          </Link>)}
        </div>}
      </section>
      <div className="detail-next"><span>ESCOPO ATUAL</span><p>Resultados gravados no disco desta instalação. O painel principal ainda usa projetos ilustrativos.</p></div>
    </Shell>
  );
}
