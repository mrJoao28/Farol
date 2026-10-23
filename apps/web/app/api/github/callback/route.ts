import { NextRequest, NextResponse } from "next/server";
import { saveInstallation, verifyInstallation } from "@/lib/github-app";
import { matchingState } from "@/lib/github-selection";
import { localRunsEnabled } from "@/lib/runs";

export async function GET(request: NextRequest) {
  if (!localRunsEnabled()) return new Response(null, { status: 404 });
  const state = request.nextUrl.searchParams.get("state");
  const cookie = request.cookies.get("farol_github_state")?.value;
  const id = Number(request.nextUrl.searchParams.get("installation_id"));
  let error: string | null = null;
  if (!matchingState(cookie, state)) error = "github-state";
  else if (!Number.isSafeInteger(id) || id <= 0) error = "github-installation";
  else {
    try { await saveInstallation(await verifyInstallation(id)); }
    catch { error = "github-installation"; }
  }
  const response = NextResponse.redirect(new URL(`/projects/new${error ? `?error=${error}` : "?connected=1"}`, request.url));
  response.cookies.delete("farol_github_state");
  return response;
}
