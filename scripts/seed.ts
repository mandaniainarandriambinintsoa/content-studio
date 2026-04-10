import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
const sql = neon(process.env.DATABASE_URL);

const projects = [
  { name: "LinkedIn Presence", slug: "linkedin-presence", description: "Dashboard banque de posts LinkedIn" },
  { name: "Factupro", slug: "factupro", description: "Outil de facturation perso" },
  { name: "Facebook Agent IA", slug: "facebook-agent-ia", description: "Bot Messenger avec LangGraph" },
  { name: "Content Studio", slug: "content-studio", description: "Pipeline vidéo multi-plateforme" },
];

async function main() {
  console.log("Seeding projects...");
  for (const p of projects) {
    await sql`
      INSERT INTO projects (name, slug, description)
      VALUES (${p.name}, ${p.slug}, ${p.description})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
