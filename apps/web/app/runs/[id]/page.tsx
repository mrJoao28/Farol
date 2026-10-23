import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { formatRunDate, getRun } from "@/lib/runs";

export const dynamic = "force-dynamic";

export default async function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getRun(id);
  if (!run) notFound();
  const failed = run.steps.find(step => step.status === "failed");

  return (
    <Shell section="runs">
      <Link href="/runs" className="back-link">← Voltar às execuções</Link>
      <div className="detail-heading"><div><p className={`overline ${failed ? "alert" : ""}`}>{failed ? "● FALHA DETECTADA" : "● JORNADA SAUDÁVEL"}</p><h1>{run.journey}<span>.</span></h1><p className="supporting-copy">{formatRunDate(run.startedAt)} · {(run.durationMs / 1000).toFixed(1)} s · demo local</p></div><span className="incident-id">{id.slice(0, 8).toUpperCase()}</span></div>
      <div className="detail-grid">
        <section className="detail-panel" aria-labelledby="diagnosis-heading">
          <p className={`small-caps ${failed ? "error-label" : "success-label"}`}>{failed ? `ETAPA ${failed.index} DE ${run.definition.steps.length} · FALHOU` : `${run.steps.length} ETAPAS CONCLUÍDAS`}</p>
          <h2 id="diagnosis-heading">{failed ? "A jornada parou nesta etapa" : "Todas as etapas passaram"}</h2>
          {failed ? <p className="run-error">{failed.error}</p> : <p>A navegação e as verificações terminaram com sucesso.</p>}
          <div className="step-results">{run.definition.steps.map((step, index) => {
            const result = run.steps[index];
            const label = step.action === "open" ? `Abrir ${step.path}` : `${step.action === "click" ? "Clicar" : "Verificar"} ${step.role}: ${step.name}`;
            return <div className={`result-row ${!result ? "not-run" : result.status === "failed" ? "failed" : "passed"}`} key={index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><span>{!result ? "Não executada" : result.status === "failed" ? "Falhou" : "Concluída"}</span></div>;
          })}</div>
        </section>
        <aside className="evidence-panel" aria-label="Evidência da execução"><div className="evidence-top"><span>EVIDÊNCIA</span><span>{run.screenshot ? "CAPTURA DE TELA" : "SEM CAPTURA"}</span></div>
          {run.screenshot ? <div className="run-screenshot"><a href={`/api/runs/${id}/screenshot`} target="_blank" rel="noreferrer"><Image src={`/api/runs/${id}/screenshot`} alt="Tela capturada no momento da falha" width={780} height={540} unoptimized /></a></div> : <div className="evidence-center"><span aria-hidden="true">✓</span><h2>Jornada concluída.</h2><p>A captura de tela é guardada quando uma etapa falha.</p></div>}
          <div className="evidence-bottom"><span>{run.trace ? <a href={`/api/runs/${id}/trace`}>BAIXAR TRACE DE DIAGNÓSTICO ↗</a> : "TRACE NÃO GUARDADO"}</span><span>PLAYWRIGHT</span></div>
        </aside>
      </div>
    </Shell>
  );
}
