"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveScript, generateScriptFromBrief } from "./actions";
import { estimateDurationSeconds } from "@/lib/utils";
import type { Project, ScriptStatus } from "@/lib/types";

interface Props {
  projects: Project[];
}

type DurationTarget = "30s" | "45s" | "60s";

export default function StudioForm({ projects }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState<string>(projects[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [hook, setHook] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [status, setStatus] = useState<ScriptStatus>("draft");

  // Generator brief
  const [showBrief, setShowBrief] = useState(false);
  const [topic, setTopic] = useState("");
  const [stack, setStack] = useState("");
  const [pains, setPains] = useState("");
  const [solution, setSolution] = useState("");
  const [durationTarget, setDurationTarget] = useState<DurationTarget>("45s");

  const fullText = [hook, body, cta].filter(Boolean).join("\n\n");
  const estimated = fullText ? estimateDurationSeconds(fullText) : 0;

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    const result = await generateScriptFromBrief({
      topic,
      stack,
      pains,
      solution,
      durationTarget,
    });
    setGenerating(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setTitle(result.script.title);
    setHook(result.script.hook);
    setBody(result.script.body);
    setCta(result.script.cta);
    setShowBrief(false);
  }

  async function handleSave() {
    setError(null);
    if (!title.trim() || !body.trim()) {
      setError("Titre et body sont obligatoires");
      return;
    }
    startTransition(async () => {
      const result = await saveScript({
        id: null,
        project_id: projectId || null,
        title,
        hook: hook || null,
        body,
        cta: cta || null,
        duration_seconds: estimated || null,
        status,
      });
      if (result.id) {
        router.push("/scripts");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card p-5">
        <button className="btn btn-ghost" onClick={() => setShowBrief((v) => !v)}>
          {showBrief ? "Masquer le brief" : "Générer depuis un brief (Claude)"}
        </button>

        {showBrief && (
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
                Sujet
              </label>
              <input
                className="input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: pourquoi j'ai choisi n8n self-hosted plutôt que Zapier"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
                Stack choisi
              </label>
              <input
                className="input"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="n8n / Docker / VPS Hetzner"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
                Pains des alternatives
              </label>
              <textarea
                className="textarea"
                rows={3}
                value={pains}
                onChange={(e) => setPains(e.target.value)}
                placeholder="Zapier cher au zap, Make capé, Pipedream limité..."
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
                Solution / ce qui a été construit
              </label>
              <textarea
                className="textarea"
                rows={3}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="VPS Hetzner 3€/mois, invocations illimitées, cron reminder posts..."
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
                Durée cible
              </label>
              <select
                className="select max-w-[120px]"
                value={durationTarget}
                onChange={(e) => setDurationTarget(e.target.value as DurationTarget)}
              >
                <option value="30s">30s</option>
                <option value="45s">45s</option>
                <option value="60s">60s</option>
              </select>
              <button
                className="btn btn-primary ml-auto"
                onClick={handleGenerate}
                disabled={generating || !topic.trim() || !stack.trim()}
              >
                {generating ? "Génération..." : "Générer le script"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
              Titre
            </label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
              Projet
            </label>
            <select className="select" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">— Aucun —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
            Hook (tension + bridge stack)
          </label>
          <textarea className="textarea" rows={4} value={hook} onChange={(e) => setHook(e.target.value)} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
            Body (pain → forces → ce qui est construit)
          </label>
          <textarea className="textarea" rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide mb-1 block" style={{ color: "var(--color-muted)" }}>
            CTA
          </label>
          <input className="input" value={cta} onChange={(e) => setCta(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
            Status
          </label>
          <select
            className="select max-w-[160px]"
            value={status}
            onChange={(e) => setStatus(e.target.value as ScriptStatus)}
          >
            <option value="idea">idea</option>
            <option value="draft">draft</option>
            <option value="ready">ready</option>
            <option value="recorded">recorded</option>
            <option value="published">published</option>
          </select>
          <div className="ml-auto text-xs" style={{ color: "var(--color-muted)" }}>
            Durée estimée : ~{estimated}s
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={pending}>
            {pending ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>

        {error && (
          <div className="text-sm p-3 rounded" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
