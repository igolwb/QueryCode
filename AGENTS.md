# AGENTS.md — QueryCode

Concise guidance for AI agents working on this repo.

## Stack

- Next.js App Router + TypeScript
- MongoDB via Mongoose — `connectDB()` in [lib/mongodb.ts](lib/mongodb.ts) (global connection cache for hot reload)
- Tailwind + shadcn/ui ([components/ui](components/ui))
- Auth0 user identity (`User.auth0Id`)

**Env:** `MONGODB_URI` (required for any DB work).

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install deps |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Layout

| Path | Role |
|------|------|
| [app](app) | Pages, layouts, API routes (`app/api/<resource>/route.ts`) |
| [lib/mongodb.ts](lib/mongodb.ts) | `connectDB()` before DB access |
| [models](models) | Mongoose schemas (see below) |
| [components](components) | React UI |

Export pattern for all models: `models.X || model("X", schema)`.

---

## Data model

Six collections. References use `Schema.Types.ObjectId` + `ref`.

```
User ──owns──► Snippet ◄──language── Language
                │  ▲
                │  └── tags[] ──► Tag
                │
         Like / Favorite (user + snippet edges)
```

### Models ([models/](models))

| Model | File | Key fields | Indexes |
|-------|------|------------|---------|
| **User** | `users.ts` | `auth0Id` (unique), `email` (unique), `name`, `profileImage`, `description`, `lastLoginAt` | `auth0Id`, `email` |
| **Snippet** | `snippets.ts` | `name` (≤20), `code` (≤10k), `description` (≤500), `visibility` (`public` \| `private`, default `private`), `owner` → User, `language` → Language, `tags[]` → Tag (min 1), `likesCount`, `favoritesCount` | `owner`, `visibility`, `tags`, `language` |
| **Tag** | `tags.ts` | `name`, `slug` (unique, lowercase) | `slug` (unique) |
| **Language** | `languages.ts` | `name`, `slug` (unique, lowercase) | `slug` (unique) |
| **Like** | `likes.ts` | `user` → User, `snippet` → Snippet | `{ user, snippet }` (unique), `snippet` |
| **Favorite** | `favorites.ts` | `user` → User, `snippet` → Snippet | `{ user, snippet }` (unique), `snippet` |

All models use `timestamps: true`. `Like` and `Favorite` disable `updatedAt`.

### Tags (`Tag` + `Snippet.tags`)

- **`Tag`** is the single source of truth for label + slug.
- **`Snippet.tags`** is `[ObjectId]` → `Tag`, required, **at least one**. Never store tag strings on snippets.
- **API:** resolve client input (names/slugs) → find-or-create `Tag` by normalized slug → persist only ObjectIds. Populate or batch-load `Tag` in responses so renames propagate.

### Languages (`Language` + `Snippet.language`)

- Same pattern as tags: **`Language`** owns `name` + `slug`; **`Snippet.language`** is one required ObjectId ref.
- Resolve client input to a `Language` document (by slug) before save.

### Engagement (`Like` / `Favorite` + counters)

- `likesCount` / `favoritesCount` on `Snippet` are **denormalized**.
- Update counters in the **same code path** as insert/delete of `Like` / `Favorite` (±1). Prefer a **transaction** when both touch the DB.
- Optional: periodic reconciliation from `Like` / `Favorite` collections if counters drift.
- **Unique compound index** `{ user: 1, snippet: 1 }` on `Like` and `Favorite` prevents duplicate edges; duplicate inserts throw MongoDB error code `11000`.
- `likesCount` / `favoritesCount` use `min: 0`; Mongoose rejects negative values on save/update.

### Delete / cascade rules

| Action | Required cleanup |
|--------|------------------|
| Delete **Snippet** | Remove all `Like` and `Favorite` for that `snippet`; drop snippet (counters go with it). |
| Delete **User** | Remove user's `Like` / `Favorite`. For owned snippets: **cascade** delete (runs snippet cleanup), **block** until reassigned, or **transfer** `owner` — never orphan `owner`. |
| Delete **Tag** | Block while referenced, or pull tag id from `Snippet.tags` on affected snippets (same transaction). |
| Delete **Language** | Block while any snippet references it, or reassign snippets first. |

---

## Agent conventions

- Small, focused diffs; use existing models — do not redefine schemas.
- API routes: `app/api/<resource>/route.ts`, export `GET` / `POST` / etc.; call `connectDB()` first.
- Before finishing: `npm run typecheck`, `npm run lint`, `npm run format`.
- DB changes: document migrations if schema or data shape changes.

## More context

- [README.md](README.md)
- [components.json](components.json) — shadcn config
- [next.config.mjs](next.config.mjs), [tsconfig.json](tsconfig.json)
