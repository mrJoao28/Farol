import { timingSafeEqual } from "node:crypto";
import type { RepositoryLink } from "./projects";

export function matchingState(expected: string | undefined, received: string | null): boolean {
  if (!expected || !received || !/^[a-f0-9]{64}$/.test(expected) || !/^[a-f0-9]{64}$/.test(received)) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function selectedRepository(repositories: RepositoryLink[], id: string): RepositoryLink {
  const repositoryId = Number(id);
  const repository = Number.isSafeInteger(repositoryId) && repositoryId > 0 ? repositories.find(item => item.id === repositoryId) : null;
  if (!repository) throw new Error("Repositório não autorizado ou removido da instalação.");
  return repository;
}
