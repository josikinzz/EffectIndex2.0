# EffectIndex

> A nuxt.js-based content management system designed for https://effectindex.com

## Installation

1. Install Git and Node 22 (LTS)
2. (optional) Install and run MongoDB only if you need to regenerate static content from a local database.
3. `git clone https://github.com/effectindex/EffectIndex`
4. `cd EffectIndex`
5. If you use `nvm`, run `nvm use` to pick up the Node version in `.nvmrc`
6. `npm install`
7. Create a `.env` file in the `EffectIndex` directory with the following contents:
```bash
# URL of the server
BASE_URL=http://localhost:3000
# Public base URL for browser API requests (defaults to BASE_URL if unset)
BROWSER_BASE_URL=http://localhost:3000
# Optional: base URL used by sitemap generation to fetch dynamic routes
SITEMAP_API_BASE_URL=http://localhost:3000
# Optional: fallback API used by static data generation if local MongoDB has no content
STATIC_DATA_API_BASE_URL=
# Browse-only mode removes account/admin routes and disables write APIs
BROWSE_ONLY_MODE=true
# A secret for the JSON Web Tokens
jwtSecret=change_this_to_something_other_than_this
# MongoDB connection (either set MONGOOSE_URI or DATABASE_NAME)
MONGOOSE_URI=mongodb://localhost:27017/effectindex
# DATABASE_NAME=effectindex
# Optional: SendGrid API key for email
SENDGRID_API_KEY=
# Optional: Cloudflare Turnstile site key
CF_SITE_KEY=
# Optional: Google Analytics 4 measurement ID
GA_MEASUREMENT_ID=
```
8. (optional) Download a [dump of the database](https://effectindex.com/dump-2023-01-30.tgz) and use the MongoDB `mongorestore` utility to restore it.
  - Extract the zip file to a folder
  - `mongorestore --db effectindex dump/effectindex`
9. Use `npm run dev` to run the development server, `npm run build` to build the production server bundle, and `npm run start` to start the production server bundle.

## Static Browse-Only Build

Use this mode when you want a fully static, browse-only site with no account/admin pages and no runtime DB/API requirement:

1. Ensure `BROWSE_ONLY_MODE=true` in `.env`.
2. Choose a content source for static data:
  - Use local MongoDB content (if available), or
  - Set `STATIC_DATA_API_BASE_URL` to a reachable EffectIndex-compatible API.
3. Run `npm run generate`.

This command will:
- Build route/search manifests via `npm run build:static-data`.
- Build static API artifacts in `static/data/api-data.json`.
- Pre-render all discovered public routes.
- Output static files in `.output/public`.

If local MongoDB is empty, set `STATIC_DATA_API_BASE_URL` (or `SITEMAP_API_BASE_URL`) to a reachable API base so route/search data can be fetched for pre-rendering.

You can preview the final static build with:

```bash
npx serve .output/public
```

**Note:** Node 22 is required. If you have `nvm` installed, `nvm use` while in the `EffectIndex` directory will automatically use the right version.

**Note:** If you choose to run MongoDB locally and your computer supports IPv6, use `--ipv6` when running `mongod`, otherwise EffectIndex may fail to connect to the database.
