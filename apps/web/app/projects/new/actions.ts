"use server";

import { redirect } from "next/navigation";
import { listInstallationRepositories, readInstallation } from "@/lib/github-app";
import { selectedRepository } from "@/lib/github-selection";
import { createProject, validateProjectInput, type RepositoryLink } from "@/lib/projects";
import { localRunsEnabled } from "@/lib/runs";

export async function addProject(formData: FormData) {
  if (!localRunsEnabled()) redirect("/projects/new?error=disabled");
  const name = formData.get("name");
  const deployUrl = formData.get("deployUrl");
  const environment = formData.get("environment");
  const repositoryId = formData.get("repositoryId");
  if (typeof name !== "string" || typeof deployUrl !== "string" || typeof environment !== "string" || typeof repositoryId !== "string") {
    redirect("/projects/new?error=fields");
  }
  let fields: ReturnType<typeof validateProjectInput>;
  try { fields = validateProjectInput({ name, deployUrl, environment }); }
  catch { redirect("/projects/new?error=fields"); }

  let repository: RepositoryLink | null = null;
  if (repositoryId !== "none") {
    try {
      const installation = await readInstallation();
      if (!installation) redirect("/projects/new?error=github");
      repository = selectedRepository(await listInstallationRepositories(installation), repositoryId);
    } catch { redirect("/projects/new?error=github"); }
  }
  try {
    const project = await createProject(fields, repository);
    redirect(`/projects/${project.id}`);
  } catch (error) {
    // Next.js redirects throw; preserve the successful redirect.
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
    redirect("/projects/new?error=storage");
  }
}
