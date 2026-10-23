import { randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { validRunId } from "./runs";

export type RepositoryLink = { id: number; installationId: number; fullName: string; htmlUrl: string };
export type Project = {
  id: string;
  name: string;
  deployUrl: string;
  environment: "production" | "staging";
  repository: RepositoryLink | null;
  createdAt: string;
};

export const projectsDirectory = () => resolve(process.cwd(), ".farol/projects");

export function validateProjectInput(input: { name: string; deployUrl: string; environment: string }) {
  const name = input.name.trim();
  if (!name || name.length > 80) throw new Error("Informe um nome de até 80 caracteres.");
  if (input.environment !== "production" && input.environment !== "staging") throw new Error("Ambiente inválido.");
  let url: URL;
  try { url = new URL(input.deployUrl.trim()); } catch { throw new Error("Informe uma URL HTTPS válida."); }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || !host.includes(".") || isIP(host) !== 0 ||
      host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") ||
      url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Use a origem HTTPS pública do site, sem caminho, credenciais ou parâmetros.");
  }
  return { name, deployUrl: url.origin, environment: input.environment } as const;
}

export async function createProject(input: { name: string; deployUrl: string; environment: string }, repository: RepositoryLink | null, directory = projectsDirectory()): Promise<Project> {
  const fields = validateProjectInput(input);
  const project: Project = { ...fields, id: randomUUID(), repository, createdAt: new Date().toISOString() };
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, `${project.id}.json`), JSON.stringify(project, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  return project;
}

export async function getProject(id: string, directory = projectsDirectory()): Promise<Project | null> {
  if (!validRunId(id)) return null;
  try {
    const value: unknown = JSON.parse(await readFile(join(directory, `${id}.json`), "utf8"));
    if (!value || typeof value !== "object") return null;
    const project = value as Partial<Project>;
    if (project.id !== id || typeof project.name !== "string" || typeof project.deployUrl !== "string" ||
        (project.environment !== "production" && project.environment !== "staging")) return null;
    return project as Project;
  } catch { return null; }
}

export async function listProjects(directory = projectsDirectory()): Promise<Project[]> {
  try {
    const files = await readdir(directory);
    const projects = await Promise.all(files.filter(file => file.endsWith(".json")).map(file => getProject(file.slice(0, -5), directory)));
    return projects.filter((project): project is Project => project !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch { return []; }
}
