import { sql } from "@/lib/db";
import type { Script } from "@/lib/types";

export default async function ScriptsPage() {
  const scripts = (await sql`
    SELECT id, title, hook, status, duration_seconds, created_at
    FROM scripts
    ORDER BY created_at DESC
  `) as Pick<Script, "id" | "title" | "hook" | "status" | "duration_seconds" | "created_at">[];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Scripts</h1>
      {scripts.length === 0 ? (
        <div className="card p-8 text-center" style={{ color: "var(--color-muted)" }}>
          Aucun script pour l'instant. Va dans <strong>Studio</strong> pour en créer un.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {scripts.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{s.title}</div>
                <span className={`badge badge-${s.status}`}>{s.status}</span>
              </div>
              {s.hook && (
                <div className="text-sm" style={{ color: "var(--color-muted)" }}>
                  {s.hook.slice(0, 140)}
                </div>
              )}
              {s.duration_seconds != null && (
                <div className="text-xs mt-2" style={{ color: "var(--color-muted)" }}>
                  ~{s.duration_seconds}s
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
