# QueryCode API

Feature-first REST API on Next.js App Router.

## Architecture

```
app/api/*/route.ts          → thin handlers (withHandler + controller)
features/[feature]/
  controllers/              → HTTP in/out, Zod parse, call services
  services/                 → business rules, permissions, orchestration
  repositories/             → Mongoose queries only
  validations/              → Zod schemas
  types/                    → DTOs
  utils/                    → mappers, small helpers
lib/api/                    → responses, errors, handler wrapper, parse
lib/auth/                   → request user resolution (Auth0-ready)
lib/db/                     → mongo helpers, transactions
models/                     → Mongoose schemas
```

## Response format

**Success:** `{ "success": true, "data": ... }`

**Error:** `{ "success": false, "error": { "message": "...", "code": "..." } }`

## Authentication (interim)

Until Auth0 middleware is wired, send one of:

| Header | Purpose |
|--------|---------|
| `x-user-id` | MongoDB User `_id` (24-char hex) |
| `x-auth0-sub` | Auth0 subject — resolved via `User.auth0Id` |

## Endpoints

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users` | — | Sync user after login (`auth0Id`, `email`, `name`) |
| GET | `/api/users/me` | ✓ | Current user profile |
| PATCH | `/api/users/me` | ✓ | Update profile |

### Tags

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/tags` | — | List tags (`?search=&page=&limit=`) |
| POST | `/api/tags` | — | Create tag catalog entry |

### Languages

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/languages` | — | List languages |
| POST | `/api/languages` | — | Create language catalog entry |

### Snippets

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/snippets` | optional | List/filter/paginate |
| POST | `/api/snippets` | ✓ | Create snippet |
| GET | `/api/snippets/:id` | optional | Get one |
| PATCH | `/api/snippets/:id` | ✓ owner | Update |
| DELETE | `/api/snippets/:id` | ✓ owner | Delete + cascade likes/favorites |

**List query params:** `page`, `limit`, `visibility`, `ownerId`, `language`, `tag`, `search`, `mine=true`

### Engagement

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/snippets/:id/likes` | ✓ | Like (+1 counter, transaction) |
| DELETE | `/api/snippets/:id/likes` | ✓ | Unlike |
| POST | `/api/snippets/:id/favorites` | ✓ | Favorite |
| DELETE | `/api/snippets/:id/favorites` | ✓ | Unfavorite |

## Examples

### Create snippet

```http
POST /api/snippets
x-user-id: 507f1f77bcf86cd799439011
Content-Type: application/json

{
  "name": "Hello API",
  "code": "console.log('hi')",
  "description": "Demo",
  "visibility": "public",
  "language": "javascript",
  "tags": ["nodejs", "api"]
}
```

**201**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Hello API",
    "language": { "id": "...", "name": "JavaScript", "slug": "javascript" },
    "tags": [{ "id": "...", "name": "nodejs", "slug": "nodejs" }],
    "likesCount": 0,
    "favoritesCount": 0
  }
}
```

### List public snippets

```http
GET /api/snippets?page=1&limit=10&visibility=public
```

### Error

```json
{
  "success": false,
  "error": {
    "message": "Only the snippet owner can perform this action",
    "code": "FORBIDDEN"
  }
}
```
