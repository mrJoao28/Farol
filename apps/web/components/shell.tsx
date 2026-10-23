import Image from "next/image";
import Link from "next/link";

type ShellProps = {
  children: React.ReactNode;
  section: "overview" | "incident" | "runs" | "projects";
};

export function Shell({ children, section }: ShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Farol, página inicial">
          <Image src="/brand/farol-app-icon.svg" alt="" width={34} height={34} priority />
          <span>FAROL</span>
        </Link>

        <div className="workspace-label">ESPAÇO DE TRABALHO</div>
        <div className="workspace-name">João Felipe <span>↗</span></div>

        <nav className="main-nav" aria-label="Principal">
          <Link href="/" className={section === "overview" ? "current" : ""} aria-current={section === "overview" ? "page" : undefined}>
            <span className="nav-index">01</span> Visão geral
          </Link>
          <Link href="/projects" className={section === "projects" ? "current" : ""} aria-current={section === "projects" ? "page" : undefined}><span className="nav-index">02</span> Projetos</Link>
          <Link href="/incidents/demo" className={section === "incident" ? "current" : ""} aria-current={section === "incident" ? "page" : undefined}>
            <span className="nav-index">03</span> Incidente demonstrativo
          </Link>
          <Link href="/runs" className={section === "runs" ? "current" : ""} aria-current={section === "runs" ? "page" : undefined}>
            <span className="nav-index">04</span> Execuções locais
          </Link>
        </nav>

        <div className="sidebar-footer"><span className="live-dot" /> FAROL EM DESENVOLVIMENTO</div>
      </aside>

      <div className="content-column">
        <header className="topbar">
          <span>FAROL / {section === "overview" ? "VISÃO GERAL" : section === "incident" ? "INCIDENTE" : section === "projects" ? "PROJETOS" : "EXECUÇÕES"}</span>
          <span className="topbar-right">DEMONSTRAÇÃO <span className="avatar">JF</span></span>
        </header>
        <main id="main-content">{children}</main>
        <footer className="app-footer">FAROL / VEJA ALÉM DO STATUS ONLINE. <span>PROJETOS ILUSTRATIVOS · EXECUÇÕES LOCAIS</span></footer>
      </div>
    </div>
  );
}
