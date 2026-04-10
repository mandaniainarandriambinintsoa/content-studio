# Content Studio

Pipeline de production vidéo solo (voix clonée + Veo 3 + sous-titres auto) pour alimenter TikTok, Instagram Reels, YouTube Shorts et LinkedIn à partir d'une seule source.

## Stack

- Next.js 15 (App Router, Server Actions)
- Neon Postgres (`@neondatabase/serverless`)
- Tailwind CSS v4
- TypeScript strict
- Claude Sonnet 4.6 (scripts viraux)
- ElevenLabs (voix clonée)
- Google Veo 3 (visuels)
- CapCut (montage manuel pour l'instant)

## Dev

```bash
pnpm install
pnpm dev            # http://localhost:3008
```

## Phase 1 (MVP manuel)

1. Écrire un script dans `/studio`
2. Générer la voix via ElevenLabs (manuel pour l'instant)
3. Générer les clips Veo 3 (manuel)
4. Montage CapCut
5. Publier sur les 4 plateformes, tracker dans `/calendar`

## Phase 2 (automation n8n)

Pipeline complet via n8n self-hosted : script → ElevenLabs → Veo 3 → CapCut API → publication multi-plateforme.
