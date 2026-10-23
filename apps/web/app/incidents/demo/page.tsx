import Link from "next/link";
import { Shell } from "@/components/shell";

const steps = [
  { label: "Abrir página inicial", result: "Concluída", className: "passed" },
  { label: "Clicar em Solicitar orçamento", result: "Concluída", className: "passed" },
  { label: "Encontrar formulário de contato", result: "Falhou", className: "failed" },
  { label: "Validar campos visíveis", result: "Não executada", className: "not-run" },
];

export default function DemoIncident() {
  return (
    <Shell section="incident">
      <div className="preview-note" role="status"><span>PRÉVIA</span> Incidente ilustrativo. Nenhum navegador executou esta jornada.</div>
      <Link href="/" className="back-link">← Voltar à visão geral</Link>
      <div className="detail-heading"><div><p className="overline alert">● &nbsp; INCIDENTE DEMONSTRATIVO</p><h1>Solicitar orçamento<span>.</span></h1><p className="supporting-copy">JDM Engenharia / mrJoao28/JDM-Landing-Page</p></div><span className="incident-id">EXEMPLO / #142</span></div>
      <div className="detail-grid">
        <section className="detail-panel" aria-labelledby="diagnosis-heading">
          <p className="small-caps error-label">ETAPA 03 DE 04 · FALHOU</p>
          <h2 id="diagnosis-heading">Formulário de contato não encontrado</h2>
          <p>Após o clique em “Solicitar orçamento”, o elemento esperado não apareceu. Este texto demonstra como o Farol apresentará a causa e o contexto de uma execução real.</p>
          <div className="step-results">{steps.map((step, index) => <div className={`result-row ${step.className}`} key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.label}</strong><span>{step.result}</span></div>)}</div>
        </section>
        <aside className="evidence-panel" aria-labelledby="evidence-heading"><div className="evidence-top"><span>EVIDÊNCIA</span><span>01 / CAPTURA</span></div><div className="evidence-center"><span aria-hidden="true">⌗</span><h2 id="evidence-heading">A imagem da falha aparecerá aqui.</h2><p>As capturas serão produzidas pelo worker Playwright na etapa de execução real.</p></div><div className="evidence-bottom">SEM ARTEFATO NESTA PRÉVIA <span>—</span></div></aside>
      </div>
      <div className="detail-next"><span>JORNADA REAL</span><p>O runner já executa uma demo local. <Link href="/runs">Veja o histórico e as evidências ↗</Link></p></div>
    </Shell>
  );
}
