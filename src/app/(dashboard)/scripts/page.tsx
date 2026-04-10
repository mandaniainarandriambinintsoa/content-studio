import Link from "next/link";
import { sql } from "@/lib/db";
import type { Script } from "@/lib/types";
import DeleteButton from "./delete-button";

interface ScriptRow extends Pick<Script, "id" | "title" | "hook" | "body" | "cta" | "status" | "duration_seconds" | "created_at"> {
  project_name: string | null;
}

export default async function ScriptsPage() {
  const scripts = (await sql`
    SELECT
      s.id, s.title, s.hook, s.body, s.cta, s.status, s.duration_seconds, s.created_at,
      p.name AS project_name
    FROM scripts s
    LEFT JOIN projects p ON p.id = s.project_id
    ORDER BY s.created_at DESC
  `) as ScriptRow[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Scripts</h1>
        <Link href="/studio" className="btn btn-primary">
          Nouveau script
        </Link>
      </div>

      {scripts.length === 0 ? (
        <div className="card p-8 text-center" style={{ color: "var(--color-muted)" }}>
          Aucun script pour l'instant. Va dans <Link href="/studio" className="underline">Studio</Link> pour en créer un.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {scripts.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-center justify-between mb-2 gap-3">
                <div className="font-medium">{s.title}</div>
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${s.status}`}>{s.status}</span>
                  {s.project_name && (
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                      {s.project_name}
                    </span>
                  )}
                </div>
              </div>
              {s.hook && (
                <div className="text-sm whitespace-pre-wrap mb-2">
                  {s.hook.slice(0, 200)}
                  {s.hook.length > 200 ? "…" : ""}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {s.duration_seconds != null ? `~${s.duration_seconds}s` : ""}
                </div>
                <DeleteButton id={s.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
