"use server";

import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { redirect } from "next/navigation";
import { localRunsEnabled, validRunId } from "@/lib/runs";

let activeRun = false;

export async function runDemo(formData: FormData) {
  if (!localRunsEnabled()) redirect("/runs?error=disabled");
  const variant = formData.get("variant");
  if (variant !== "healthy" && variant !== "broken") redirect("/runs?error=invalid");
  if (activeRun) redirect("/runs?error=busy");

  try {
    const response = await fetch("http://127.0.0.1:4173/", { cache: "no-store", signal: AbortSignal.timeout(2000) });
    if (!response.ok) redirect("/runs?error=demo");
  } catch {
    redirect("/runs?error=demo");
  }

  activeRun = true;
  let id: string | null = null;
  try {
    id = await new Promise<string>((done, fail) => {
      const child = spawn(process.execPath, ["--import", "tsx", "src/cli.ts", `examples/contact${variant === "broken" ? "-broken" : ""}.json`], {
        cwd: resolve(process.cwd(), "../worker"), stdio: ["ignore", "pipe", "pipe"],
      });
      let output = "";
      let errorOutput = "";
      const timeout = setTimeout(() => child.kill("SIGKILL"), 75_000);
      child.stdout.on("data", (chunk: Buffer) => { output += chunk.toString(); if (output.length > 128_000) child.kill("SIGKILL"); });
      child.stderr.on("data", (chunk: Buffer) => { errorOutput += chunk.toString(); if (errorOutput.length > 16_000) child.kill("SIGKILL"); });
      child.on("error", fail);
      child.on("close", code => {
        clearTimeout(timeout);
        if (code !== 0 && code !== 1) return fail(new Error("Runner indisponível"));
        try {
          const result: unknown = JSON.parse(output);
          if (result && typeof result === "object" && "id" in result && typeof result.id === "string" && validRunId(result.id)) done(result.id);
          else fail(new Error("Resposta inválida do runner"));
        } catch { fail(new Error("Resposta inválida do runner")); }
      });
    });
  } catch {
    redirect("/runs?error=runner");
  } finally {
    activeRun = false;
  }
  redirect(`/runs/${id}`);
}
