# AGENTS.md — AI agent instructions for QueryCode

This file gives concise, actionable guidance for AI coding agents working on QueryCode.

Purpose
- Help agents understand project structure, conventions, and quick setup steps.

Project overview
- Next.js (app router) + TypeScript
- MongoDB (Mongoose) for persistence — cached connection in `lib/mongodb.ts`
- Tailwind CSS + shadcn/ui (basic components under `components/ui`)

Quick setup
- Install dependencies: `npm install`
- Start dev server: `npm run dev` (uses Turbopack)
- Build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Format: `npm run format`
- Typecheck: `npm run typecheck`

Key files & locations
- [app](app) — Next.js App Router (pages, layouts, and API routes)
- [app/api/snippets/route.ts](app/api/snippets/route.ts) — example API route (POST creates a snippet)
- [lib/mongodb.ts](lib/mongodb.ts) — call `connectDB()` before DB operations; expects `MONGODB_URI`
- [models](models) — Mongoose models (`snippets.ts`, `users.ts`, `like.ts`, `favorite.ts`)
- [components](components) — React components and theme provider
- [components/ui/button.tsx](components/ui/button.tsx) — example shadcn/ui component
- [package.json](package.json) — npm scripts and dependencies
- [tsconfig.json](tsconfig.json) — TypeScript configuration
- [eslint.config.mjs](eslint.config.mjs) — linting rules
- [README.md](README.md) — repository-level notes

Database notes
- The project uses Mongoose (see `lib/mongodb.ts`). The module exports `connectDB()` and uses a global cache to avoid multiple connections during Next.js hot reloads.
- Environment variable: `MONGODB_URI` (required).

Conventions & guidance for agents
- Prefer small, focused changes and create a short PR description explaining rationale.
- Follow the App Router pattern: put HTTP handlers under `app/api/<resource>/route.ts` and export `GET`, `POST`, etc.
- Use existing Mongoose models in `models/` and avoid redefining schemas; use the `models.Model || model(...)` pattern already in place.
- Run `npm run typecheck`, `npm run lint`, and `npm run format` before proposing changes.

PR checklist (for automated agents)
- Run `npm run typecheck` and fix type errors
- Run `npm run lint` and address reported issues
- Run `npm run format` to ensure formatting consistency
- If database changes are involved, ensure `connectDB()` is called and migrations (if any) are documented

Where to look for more context
- [README.md](README.md)
- [components.json](components.json) — shadcn/ui components config
- [next.config.mjs](next.config.mjs) and [tsconfig.json](tsconfig.json)

Suggested next agent customizations
- `/create-skill dev-runner` — Skill that starts the dev server, runs a quick smoke test against `app/api/snippets/route.ts`, and reports health (useful for CI or local validation).
- `/create-hook preflight-check` — Pre-merge hook that runs `typecheck`, `lint`, and verifies `MONGODB_URI` is set for DB-affecting changes.
- `/create-prompt pr-describer` — Prompt template that summarizes changed files and suggests a concise PR description and changelog entry.

Feedback
- If you want, I can create any of the suggested customizations next (skill, hook, or prompt). Which one should I implement first?
