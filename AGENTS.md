# coscientist

coscientist is a networked note app at `coscientist.app`. A note is a Tiptap document made of blocks. Notes link to notes and embed notes by transclusion. Anyone can sign up with a verified email. Every note belongs to one account, and no account reads another account's notes.

## Stack

- Bun 1.4 runs scripts and installs packages. The production server runs on Node 24.
- TanStack Start (React 19, Vite, Nitro). Nitro picks the `vercel` preset when `VERCEL` is set at build time and `node-server` otherwise.
- Drizzle ORM on Postgres 18 through `postgres` (postgres.js). Effect 4 wraps server data access. zod validates input and the environment.
- Better Auth with email OTP and passkeys. Resend sends mail.
- Tiptap 3 defines the document schema. `@tiptap/static-renderer` renders notes with no editor and no DOM.
- use-intl holds every UI string in `messages/en.json`. The UI is English only. `lib/use-intl.d.ts` types the message keys, so an unknown key fails `typecheck`.

## Commands

| Command | Effect |
| --- | --- |
| `bun install` | Installs dependencies and applies `patches/`. |
| `scripts/local-services.sh` | Starts the local Postgres and writes `.env.local` with mode 600 when the file is absent. |
| `bun --env-file=.env.local run db:migrate` | Applies `drizzle/` with `MIGRATION_DATABASE_URL`. |
| `bun --env-file=.env.local run db:generate --name=<name>` | Writes a migration from the schema diff. Add `--custom` for a hand-written migration. |
| `bun --env-file=.env.local run dev` | Starts the dev server at `http://localhost:3100`. |
| `bun run build` | Builds the production server into `.output/`, or `.vercel/output/` on Vercel. |
| `PORT=3100 node --env-file=.env.local .output/server/index.mjs` | Runs the production build locally. |
| `bun run check` | Runs Ultracite: `oxfmt --check` and `oxlint`. `bun run fix` writes the fixes. |
| `bun run typecheck` | Generates `src/routeTree.gen.ts` and runs `tsc --noEmit`. |

The lefthook `pre-push` hook runs `check` and `typecheck`. `lefthook.yml` sets `assert_lefthook_installed: true`, so a push fails when the lefthook binary is missing. Run `bun install` in the checkout that pushes.

## Environment

`lib/env.ts` parses `process.env` once at boot and throws on a missing or malformed key.

| Key | Contract |
| --- | --- |
| `DATABASE_URL` | Runtime connection as `coscientist_app`. Production uses the PgBouncer port 6432. |
| `BETTER_AUTH_SECRET` | At least 32 characters. |
| `BETTER_AUTH_URL` | Public origin, for example `https://coscientist.app`. The passkey RP ID is its hostname. |
| `RESEND_API_KEY` | Required when `VERCEL_ENV` is `preview` or `production`. |
| `EMAIL_FROM` | Sender address. Required when `VERCEL_ENV` is `preview` or `production`. |
| `VERCEL_ENV` | Set by Vercel. Any value other than `production` marks mail as test mail. |

`drizzle.config.ts` reads `MIGRATION_DATABASE_URL`, the owner role's direct connection. The app never reads it.

Without `RESEND_API_KEY` and `EMAIL_FROM`, local development prints each email, sign-in code included, to the server log.

## Local services

`docker-compose.yml` runs the Compose project `coscientist` with Postgres 18 on host port 5435 (`POSTGRES_PORT` overrides it). `docker/initdb/app-role.sql` creates `coscientist_app` on the first start of the volume. Stop the stack with `docker compose -p coscientist down`. Add `-v` to drop the data.

## Tenant isolation

- Two roles touch the database. The owner role runs migrations. `coscientist_app` serves requests and has neither SUPERUSER nor BYPASSRLS.
- Every tenant table has an `owner_id`, `ENABLE` and `FORCE ROW LEVEL SECURITY`, and the `<table>_owner_only` policy from `ownerOnly` in `lib/notes/schema.ts`. The policy compares `owner_id` with `current_setting('app.viewer_id', true)`.
- Every tenant query runs inside `withTenant(viewerId, (tx) => ...)` from `lib/tenant.ts`. It opens a transaction, sets `app.viewer_id` with `set_config(..., true)`, and throws when the connected role has SUPERUSER or BYPASSRLS.
- Child tables reference `notes (id, owner_id)` with a composite foreign key, so a row cannot attach to another account's note. `note_links.target_note_id` has no foreign key: a link to a missing note is stored and reads as dangling.
- `note_revisions` is append-only for `coscientist_app`: it has `SELECT` and `INSERT` only.
- The Better Auth tables (`user`, `session`, `account`, `verification`, `passkey`, `rate_limit`) have no RLS.
- A new table gets its `GRANT` to `coscientist_app` in a custom migration. A new tenant table also gets `owner_id`, the `ownerOnly` policy, and `FORCE ROW LEVEL SECURITY` in that migration.
- A migration that grants to `coscientist_app` fails when the role is missing, and the whole migration run rolls back.

## Production database (PlanetScale Postgres)

The PlanetScale default role has BYPASSRLS, so the app never connects with it.

1. Create the database on Postgres 18.
2. Connect as the default role over the direct port 5432 and run `CREATE ROLE coscientist_app LOGIN PASSWORD '<generated>' NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;`.
3. Set `MIGRATION_DATABASE_URL` to the default role on port 5432 with `sslmode=verify-full`, and run `bun run db:migrate`.
4. Set `DATABASE_URL` to the user `coscientist_app.<branch id>` on port 6432 with `sslmode=verify-full`.

PgBouncer on port 6432 runs in transaction mode, which keeps `set_config(..., true)` inside one server connection. `lib/pg.ts` sets `prepare: false`.

## Notes

- `lib/editor/schema.ts` is the one document schema for the server and the client. It has StarterKit, a link mark whose `href` must pass `isAllowedUri`, the inline `pageLink` node, the block `transclusion` node, and `UniqueID` on every block type.
- `readDocument` in `lib/notes/document.ts` validates a document with `nodeFromJSON` and `check()`, requires a `doc` root and a unique UUID on every block, extracts blocks and links, and returns the normalized `doc.toJSON()`. Stored JSON never holds raw HTML.
- `saveNote` in `lib/notes/store.ts` is the one write path. It updates the note only when `revision` equals the base revision, rebuilds `note_blocks` and `note_links`, and appends a revision, all in one transaction. It answers `saved`, `conflict`, or `not-found`, and fails with `InvalidDocument` before it opens a transaction.
- `backlinksQuery` and `danglingLinksQuery` in `lib/notes/store.ts` read links. Pages render notes with `renderToReactElement` and a node mapping for `pageLink` and `transclusion`.
- `getNotePageFn` runs `viewerMiddleware` before its validator, and the validator answers not found for a malformed note ID. A signed-out request to any `/notes/*` URL redirects to `/sign-in`.

## Auth and mail

- `lib/auth.ts` configures Better Auth. Only `/sign-in/email-otp` creates users, and it marks the email verified. `getViewer` accepts only verified sessions.
- `sendVerificationOTP` sends sign-in codes only. Every other OTP type throws, Better Auth logs the error, and the endpoint answers as it does for an unknown email.
- `disabledPaths` turns off every email OTP path except `/email-otp/send-verification-otp` and `/sign-in/email-otp`. `/email-otp/check-verification-otp` counts attempts with a read and a separate write, so concurrent guesses pass the attempt limit. `/email-otp/reset-password` sets a password with no mail to the account owner. `disabledPaths` does not block direct `auth.api` calls.
- A failed sign-in send answers 503 `OTP_DELIVERY_FAILED` through the `failedSignInSends` hook.
- `hooks.before` rejects an email whose domain or parent domain is on the `disposable-email-domains-js` list with 400 `DISPOSABLE_EMAIL`, unless an account with that email exists.
- The Better Auth rate limiter is on in every environment, with database storage in `rate_limit`. The email OTP paths allow 3 requests per 60 seconds per IP. Direct `auth.api` calls skip the limiter.
- `sendEmail` in `lib/mail.ts` is the one mailer. Outside `VERCEL_ENV=production`, it prefixes the subject with `[TEST] ` and opens the body with `This email comes from a TEST setup.`.
- Sign-in and sign-out end with a full document navigation through `location.assign`, so the router cache of the previous account does not survive.
- `noStoreMiddleware` in `src/start.ts` sets `cache-control: no-store` on every response the Start handler builds. The back-forward cache and the HTTP cache keep no account page, so **Back** after sign-out reloads and redirects to `/sign-in`.

## Server code boundary

Code that imports `lib/auth.ts`, `lib/pg.ts`, `lib/env.ts`, `lib/mail.ts`, or `lib/tenant.ts` runs on the server only. Reach it through `createServerFn`, `createServerOnlyFn`, a middleware `.server()` callback, or a route `server.handlers` entry. A plain exported function in a module the client imports keeps the whole server graph in the client bundle. After a build, `grep -l DATABASE_URL .output/public/_build/*.js` prints nothing.

## Conventions

- Write no code comments. Rationale goes in the PR body or this file.
- Write no unit tests. End-to-end coverage runs through qa-interns against `.devcontainer/`.
- Lint and format with Ultracite. No suppressions and no per-path overrides.
- `src/styles.css` sets `--font-sans` to the Tailwind 4.0 stack, which starts with `ui-sans-serif, system-ui, sans-serif`. The Tailwind 4.3.3 default stack names only families that Chrome on Linux rejects as substitutes when Liberation Sans and Noto Sans are missing, so spaces and digits render from Noto Color Emoji.
- `patches/drizzle-kit@0.31.11.patch` makes `drizzle-kit migrate` print the error of a failed migration. `drizzle-kit` is pinned to that version. On an upgrade, regenerate the patch with `bun patch drizzle-kit`.
- Memories live in `.memory/`, indexed by `.memory/MEMORY.md`.

## Deploy

The Vercel project `coscientist` builds with `vercel.json` `"framework": null`. A merge to `master` deploys production. Branches deploy previews.

## End-to-end target

`.devcontainer/` runs the production build beside the Compose Postgres. Its seed migrates the database and runs `.devcontainer/seed.ts`, which creates two accounts with signed session cookies and linked notes. `qa-interns validate .` checks the target, and `qa-interns run .` tests it.
