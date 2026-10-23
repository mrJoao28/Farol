import { readFile, mkdir, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { App } from "@octokit/app";
import type { RepositoryLink } from "./projects";

type Installation = { id: number; account: string };
export const installationFile = () => resolve(process.cwd(), ".farol/github-installation.json");

export function appConfig() {
  const appId = Number(process.env.GITHUB_APP_ID);
  const slug = process.env.GITHUB_APP_SLUG;
  const keyPath = process.env.GITHUB_APP_PRIVATE_KEY_PATH;
  if (!Number.isSafeInteger(appId) || appId <= 0 || !slug || !/^[a-z0-9-]+$/.test(slug) || !keyPath) return null;
  return { appId, slug, keyPath };
}

async function appClient() {
  const config = appConfig();
  if (!config) throw new Error("GitHub App não configurado.");
  const privateKey = await readFile(resolve(process.cwd(), config.keyPath), "utf8");
  return { app: new App({ appId: config.appId, privateKey }), config };
}

export async function verifyInstallation(id: number): Promise<Installation> {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Instalação inválida.");
  const { app, config } = await appClient();
  const response = await app.octokit.request("GET /app/installations/{installation_id}", { installation_id: id });
  const account = response.data.account;
  const accountName = account && ("login" in account ? account.login : account.slug);
  if (response.data.app_id !== config.appId || !accountName || response.data.suspended_at) {
    throw new Error("Instalação indisponível para este aplicativo.");
  }
  return { id, account: accountName };
}

export async function saveInstallation(value: Installation, path = installationFile()) {
  await mkdir(resolve(path, ".."), { recursive: true });
  const temp = `${path}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(value) + "\n", { mode: 0o600 });
  await rename(temp, path);
}

export async function readInstallation(path = installationFile()): Promise<Installation | null> {
  try {
    const data: unknown = JSON.parse(await readFile(path, "utf8"));
    if (!data || typeof data !== "object") return null;
    const value = data as Partial<Installation>;
    if (!Number.isSafeInteger(value.id) || typeof value.account !== "string") return null;
    return value as Installation;
  } catch { return null; }
}

export async function listInstallationRepositories(installation: Installation): Promise<RepositoryLink[]> {
  const verified = await verifyInstallation(installation.id);
  if (verified.account !== installation.account) throw new Error("Conta da instalação alterada.");
  const { app } = await appClient();
  const repositories: RepositoryLink[] = [];
  for await (const { repository } of app.eachRepository.iterator({ installationId: installation.id })) {
    if (repositories.length >= 500) throw new Error("Limite de 500 repositórios nesta versão.");
    const id = Number(repository.id);
    if (!Number.isSafeInteger(id)) throw new Error("ID de repositório fora do limite suportado.");
    repositories.push({ id, installationId: installation.id, fullName: repository.full_name, htmlUrl: repository.html_url });
  }
  return repositories.sort((a, b) => a.fullName.localeCompare(b.fullName));
}

