import { sql } from "@/lib/db";
import type { Project } from "@/lib/types";
import StudioForm from "./studio-form";

export default async function StudioPage() {
  const projects = (await sql`
    SELECT id, name, slug, description, created_at FROM projects ORDER BY name
  `) as Project[];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Studio</h1>
      <StudioForm projects={projects} />
    </div>
  );
}
