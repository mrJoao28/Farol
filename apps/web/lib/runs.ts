import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

export type SavedRun = {
  id: string;
  journey: string;
  definition: { name: string; steps: Array<{ action: string; path?: string; role?: string; name?: string }> };
  status: "passed" | "failed";
  startedAt: string;
  durationMs: number;
  steps: Array<{ index: number; action: string; status: "passed" | "failed"; durationMs: number; error?: string }>;
  screenshot?: string;
  trace?: string;
};

export const localRunsEnabled = () => process.env.NODE_ENV === "development" && process.env.FAROL_ENABLE_LOCAL_RUNS === "1";
export const runsDirectory = () => resolve(process.cwd(), "../worker/.farol/runs");
export const validRunId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);

export async function getRun(id: string): Promise<SavedRun | null> {
  if (!localRunsEnabled() || !validRunId(id)) return null;
  try {
    const run: unknown = JSON.parse(await readFile(join(runsDirectory(), id, "result.json"), "utf8"));
    if (!run || typeof run !== "object") return null;
    const value = run as Partial<SavedRun>;
    if (value.id !== id || !Array.isArray(value.steps) || !Array.isArray(value.definition?.steps) ||
        !["passed", "failed"].includes(value.status ?? "") || typeof value.startedAt !== "string" ||
        typeof value.journey !== "string" || typeof value.durationMs !== "number") return null;
    return value as SavedRun;
  } catch {
    return null;
  }
}

export async function listRuns(): Promise<SavedRun[]> {
  if (!localRunsEnabled()) return [];
  try {
    const entries = await readdir(runsDirectory(), { withFileTypes: true });
    const runs = await Promise.all(entries.filter(entry => entry.isDirectory() && validRunId(entry.name))
      .map(entry => getRun(entry.name)));
    return runs.filter((run): run is SavedRun => run !== null)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 50);
  } catch {
    return [];
  }
}

export function formatRunDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Manaus" }).format(new Date(value));
}
