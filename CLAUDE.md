# Content Studio

Pipeline de production vidéo pour lancer ma présence multi-plateforme (TikTok, Instagram Reels, YouTube Shorts, LinkedIn) sans montrer mon visage ni parler en live.

## Stack

- **Next.js 15** (App Router, Server Actions)
- **Neon Postgres** (`@neondatabase/serverless`, DB `content_studio`)
- **Tailwind CSS v4**
- **TypeScript strict**
- **Claude Sonnet 4.6** pour générer les scripts viraux
- **ElevenLabs** pour la voix clonée (ma voix)
- **Google Veo 3** pour les visuels
- **CapCut** pour le montage + sous-titres auto (manuel phase 1)
- **n8n self-hosted** pour l'automation (phase 2)

## Commandes

```bash
pnpm install
pnpm dev            # http://localhost:3008
pnpm build
```

## Architecture cible

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # sidebar + nav
│   │   ├── page.tsx            # vue d'ensemble
│   │   ├── scripts/            # banque de scripts
│   │   ├── studio/             # editor script + preview
│   │   ├── calendar/           # planning par plateforme
│   │   └── analytics/          # perfs par plateforme
│   └── api/
├── lib/
│   ├── db.ts                   # client Neon
│   ├── types.ts
│   └── utils.ts
```

## Schéma DB

- `projects` — les apps/produits à promouvoir (linkedin-presence, factupro, etc.)
- `scripts` — contenu script + hook + body + CTA + durée + statut
- `platform_posts` — une publication par plateforme (caption, hashtags, scheduled, metrics)

## Règles

- Port dev : **3008** (linkedin-presence est sur 3007)
- Compte GitHub : **PERSO** (`mandaniaina.randriambinintoa`)
- Jamais d'Arpon dans les scripts/contenus — règle confidentialité
- Pipeline manuel phase 1, automation n8n phase 2
- DB : `muddy-waterfall-73597786` / `content_studio` (même Neon project que linkedin-presence)

## Persona cible

- Voix : clone ElevenLabs de ma voix (pas de catalog voice)
- Style : build in public solo dev, comparaison de stacks, pain → solution
- Pas de visage, pas de live
