# Static Public API Inventory

Date: 2026-02-11
Scope: Public browseable surface only (`/admin/**` and `/user/**` excluded by browse-only 404 policy).

## Public Route Direct API Calls

- `pages/articles/index.vue` -> `GET /api/articles`
- `pages/articles/[slug]/index.vue` -> `GET /api/articles/:slug`
- `pages/effects/[name]/index.vue` -> `GET /api/effects/:slug`
- `pages/people/index.vue` -> `GET /api/persons/featured`
- `pages/people/[url]/index.vue` -> `GET /api/persons/:profile_url`

## Public Store API Calls Used By Public Pages/Components

- `stores/effects.ts` -> `GET /api/effects`
- `stores/articles.ts` -> `GET /api/articles`
- `stores/blog.ts` -> `GET /api/blog`, `GET /api/blog/:slug`
- `stores/reports.ts` -> `GET /api/reports`, `GET /api/reports/slug/:slug`
- `stores/replications.ts` -> `GET /api/replications`, `GET /api/replications/featured`, `GET /api/replications/byartist/:artist`, `GET /api/replications/:url`
- `stores/gallery.ts` -> `GET /api/replications/gallery`
- `stores/profiles.ts` -> `GET /api/profiles`, `GET /api/profiles/user/:username`
- `stores/redirects.ts` -> `GET /api/redirects`

## Static Resolver Coverage (`utils/static-api.ts`)

- `GET /api/effects`
- `GET /api/effects/:slug`
- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/blog`
- `GET /api/blog/:slug`
- `GET /api/reports`
- `GET /api/reports/slug/:slug`
- `GET /api/replications`
- `GET /api/replications/featured`
- `GET /api/replications/gallery`
- `GET /api/replications/byartist/:artist`
- `GET /api/replications/:url`
- `GET /api/persons`
- `GET /api/persons/featured`
- `GET /api/persons/:profile_url`
- `GET /api/profiles`
- `GET /api/profiles/user/:username`
- `GET /api/redirects`

## Known Exclusions (Intentionally Out Of Scope)

- All write endpoints (`POST`, `PUT`, `DELETE`) are blocked in browse-only static mode (`READ_ONLY_MODE`).
- Account/auth/admin endpoints under `/api/users`, `/api/invitations`, `/api/otps`, `/api/server` are retired for this relaunch.
