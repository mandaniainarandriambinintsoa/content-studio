import { sql } from "@/lib/db";

interface CountRow {
  total_scripts: number;
  ideas: number;
  ready: number;
  published: number;
  total_platform_posts: number;
}

export default async function DashboardPage() {
  const rows = (await sql`
    SELECT
      (SELECT COUNT(*)::int FROM scripts) AS total_scripts,
      (SELECT COUNT(*)::int FROM scripts WHERE status = 'idea') AS ideas,
      (SELECT COUNT(*)::int FROM scripts WHERE status = 'ready') AS ready,
      (SELECT COUNT(*)::int FROM scripts WHERE status = 'published') AS published,
      (SELECT COUNT(*)::int FROM platform_posts) AS total_platform_posts
  `) as CountRow[];
  const stats = rows[0];

  const cards = [
    { label: "Scripts total", value: stats.total_scripts },
    { label: "Idées", value: stats.ideas },
    { label: "Prêts", value: stats.ready },
    { label: "Publiés", value: stats.published },
    { label: "Posts multi-plateforme", value: stats.total_platform_posts },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--color-muted)" }}>
              {c.label}
            </div>
            <div className="text-3xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <div className="text-sm" style={{ color: "var(--color-muted)" }}>
          Pipeline phase 1 : écriture script → ElevenLabs (manuel) → Veo 3 (manuel) → CapCut → publication.
        </div>
      </div>
    </div>
  );
}
