import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { appConfig } from "@/lib/github-app";
import { localRunsEnabled } from "@/lib/runs";

export async function GET() {
  const config = appConfig();
  if (!localRunsEnabled() || !config) return new Response(null, { status: 404 });
  const state = randomBytes(32).toString("hex");
  const url = new URL(`https://github.com/apps/${config.slug}/installations/new`);
  url.searchParams.set("state", state);
  const response = NextResponse.redirect(url);
  response.cookies.set("farol_github_state", state, { httpOnly: true, sameSite: "lax", maxAge: 600, path: "/api/github", secure: false });
  return response;
}
