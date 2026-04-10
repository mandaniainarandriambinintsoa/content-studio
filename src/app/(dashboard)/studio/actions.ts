"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import type { ScriptStatus } from "@/lib/types";

interface SaveScriptInput {
  id: string | null;
  project_id: string | null;
  title: string;
  hook: string | null;
  body: string;
  cta: string | null;
  duration_seconds: number | null;
  status: ScriptStatus;
}

export async function saveScript(input: SaveScriptInput): Promise<{ id: string }> {
  if (input.id) {
    const rows = (await sql`
      UPDATE scripts SET
        project_id = ${input.project_id},
        title = ${input.title},
        hook = ${input.hook},
        body = ${input.body},
        cta = ${input.cta},
        duration_seconds = ${input.duration_seconds},
        status = ${input.status}::script_status,
        updated_at = NOW()
      WHERE id = ${input.id}
      RETURNING id
    `) as { id: string }[];
    revalidatePath("/scripts");
    revalidatePath("/");
    return rows[0];
  }

  const rows = (await sql`
    INSERT INTO scripts (project_id, title, hook, body, cta, duration_seconds, status)
    VALUES (
      ${input.project_id},
      ${input.title},
      ${input.hook},
      ${input.body},
      ${input.cta},
      ${input.duration_seconds},
      ${input.status}::script_status
    )
    RETURNING id
  `) as { id: string }[];
  revalidatePath("/scripts");
  revalidatePath("/");
  return rows[0];
}

export async function deleteScript(id: string) {
  await sql`DELETE FROM scripts WHERE id = ${id}`;
  revalidatePath("/scripts");
  revalidatePath("/");
}

interface GenerateScriptBrief {
  topic: string;
  stack: string;
  pains: string;
  solution: string;
  durationTarget: "30s" | "45s" | "60s";
}

interface GeneratedScript {
  title: string;
  hook: string;
  body: string;
  cta: string;
  estimated_duration: number;
}

export async function generateScriptFromBrief(
  brief: GenerateScriptBrief
): Promise<{ script: GeneratedScript } | { error: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: "ANTHROPIC_API_KEY n'est pas configurée dans .env.local" };
  }

  const wordsTarget =
    brief.durationTarget === "30s" ? 75 : brief.durationTarget === "45s" ? 110 : 150;

  const prompt = `Tu es expert en copywriting de scripts vidéo viraux pour TikTok, Instagram Reels et YouTube Shorts, écrits par un développeur full-stack solo (français, ton naturel, pas corporate).

Génère un script vidéo de ~${wordsTarget} mots (~${brief.durationTarget}) qui suit EXACTEMENT cette structure :

1. HOOK (1-2 phrases) : tension/suspense qui arrête le scroll. Pas d'emojis, pas de markdown, pas de clichés ("saviez-vous que", "5 astuces"). À la première personne ("j'ai", "je").
2. BRIDGE STACK : une phrase "Voici mon choix de stack, <Tool1> / <Tool2> / <Tool3>, je t'explique pourquoi."
3. PAIN DES ALTERNATIVES : expose 2-3 échecs concrets des outils concurrents (pas de critiques vagues). Chaque pain en 1 phrase courte et précise.
4. FORCES DE L'OUTIL CHOISI : comment il résout exactement ces pains, en 2-3 phrases.
5. CE QUI A ÉTÉ CONSTRUIT : implémentation réelle + résultat en chiffres si possible, 1-2 phrases.
6. CTA : une question courte qui invite à commenter.

RÈGLES :
- Ton parlé, français naturel, style "build in public solo dev"
- Aucun emoji, aucun markdown (pas de ** pas de #)
- Phrases courtes, faciles à lire à voix haute
- Répète les noms d'outils (${brief.stack}) naturellement
- Le body doit être lisible en ${brief.durationTarget} maximum

BRIEF :
- Sujet : ${brief.topic}
- Stack choisi : ${brief.stack}
- Pains à exposer : ${brief.pains}
- Solution / ce qui a été construit : ${brief.solution}

Réponds UNIQUEMENT avec un JSON valide de cette forme, sans markdown ni texte autour :
{
  "title": "titre court (max 60 chars) pour ranger le script",
  "hook": "hook 1-2 phrases\\n\\nVoici mon choix de stack, ..., je t'explique pourquoi.",
  "body": "pain alternatives + forces outil choisi + ce qui a été construit (tout d'un bloc, sauts de ligne entre paragraphes)",
  "cta": "question CTA courte",
  "estimated_duration": 45
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { error: `Claude API error (${res.status}): ${err.slice(0, 200)}` };
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { error: "Réponse Claude invalide" };
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.hook || !parsed.body) return { error: "Format de réponse inattendu" };
    return { script: parsed as GeneratedScript };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
