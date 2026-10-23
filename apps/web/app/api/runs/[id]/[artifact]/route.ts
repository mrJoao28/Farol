import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getRun, runsDirectory } from "@/lib/runs";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; artifact: string }> }) {
  const { id, artifact } = await params;
  if (artifact !== "screenshot" && artifact !== "trace") return new Response(null, { status: 404 });
  const run = await getRun(id);
  if (!run || !run[artifact]) return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(join(runsDirectory(), id, artifact === "screenshot" ? "failure.png" : "trace.zip"));
    if (bytes.length > 20_000_000) return new Response(null, { status: 413 });
    return new Response(new Uint8Array(bytes), { headers: {
      "Content-Type": artifact === "screenshot" ? "image/png" : "application/zip",
      "Content-Disposition": `${artifact === "trace" ? "attachment" : "inline"}; filename="farol-${id}.${artifact === "trace" ? "zip" : "png"}"`,
      "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
    } });
  } catch { return new Response(null, { status: 404 }); }
}
