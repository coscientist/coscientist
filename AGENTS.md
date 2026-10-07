# coscientist

coscientist is a networked note app at `coscientist.app`. A note is a Tiptap document made of blocks. Notes link to notes and embed notes by transclusion. Anyone can sign up with a verified email. Every note belongs to one account, and no account reads another account's notes.

## Stack

- Bun 1.4 runs scripts and installs packages. The production server runs on Node 24.
- TanStack Start (React 19, Vite, Nitro). Nitro picks its preset from the build environment: `vercel` on a Vercel build and `node-server` for a local `bun run build`. A local build with `VERCEL_ENV` or `NOW_BUILDER` in its environment also picks `vercel` and writes `.vercel/output/`.
- Drizzle ORM on Postgres 18 through `postgres` (postgres.js). Effect 4 wraps server data access. zod validates input and the environment.
- Better Auth with email OTP and passkeys. Resend sends mail.
- Tiptap 3 defines the document schema. `@tiptap/static-renderer` renders notes with no editor and no DOM.
- use-intl holds every UI string in `messages/en.json`. The UI is English only. `lib/use-intl.d.ts` types the message keys, so an unknown key fails `typecheck`. `translate` in `lib/i18n.ts` serves code outside React, such as the route `head` titles.

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

`lib/env.ts` parses `process.env` and throws on a missing or malformed key. The Nitro plugin `server/plugins/env.ts`, registered in `vite.config.ts`, imports it. The `node-server` build exits at startup, before it listens. A Vercel function throws when its module loads at cold start. `vite dev` prints the error at startup, keeps listening, and answers 500 to every request. No build step evaluates `lib/env.ts`, so a Vercel deployment with a missing key builds, and then every request the function serves fails.

| Key | Contract |
| --- | --- |
| `DATABASE_URL` | Runtime connection as `coscientist_app`. Production uses the PgBouncer port 6432. |
| `BETTER_AUTH_SECRET` | At least 32 characters. |
| `BETTER_AUTH_URL` | Public origin, for example `https://coscientist.app`. The passkey RP ID is its hostname. |
| `RESEND_API_KEY` | Required when `VERCEL_ENV` is `preview` or `production`. |
| `EMAIL_FROM` | Sender address. Required when `VERCEL_ENV` is `preview` or `production`. |
| `VERCEL_ENV` | Set by Vercel. Unset, empty, `development`, `preview`, or `production`. Any other value fails the parse. Every value other than `production` marks mail as test mail. |

`drizzle.config.ts` reads `MIGRATION_DATABASE_URL`, the owner role's direct connection. The app never reads it.

Without `RESEND_API_KEY` and `EMAIL_FROM`, local development prints each email, sign-in code included, to the server log.

## Local services

`docker-compose.yml` runs the Compose project `coscientist` with Postgres 18 on host port 5435 (`POSTGRES_PORT` overrides it). `docker/initdb/app-role.sql` creates `coscientist_app` on the first start of the volume. Stop the stack with `docker compose -p coscientist down`. Add `-v` to drop the data.

## Tenant isolation

- Two roles touch the database. The owner role runs migrations. `coscientist_app` serves requests and has neither SUPERUSER nor BYPASSRLS.
- Every tenant table has an `owner_id`, `ENABLE` and `FORCE ROW LEVEL SECURITY`, and the `<table>_owner_only` policy from `ownerOnly` in `lib/notes/schema.ts`. The policy compares `owner_id` with `current_setting('app.viewer_id', true)`.
- Every tenant query runs inside `withTenant(viewerId, (tx) => ...)` from `lib/tenant.ts`. It opens a transaction, sets `app.viewer_id` with `set_config(..., true)`, and throws when the connected role has SUPERUSER or BYPASSRLS. It logs every failure with its cause to stderr through `Effect.logError`, because Start answers an error from a server function handler with status 200 and logs nothing. It logs the Postgres error in place of drizzle's `DrizzleQueryError`, whose message holds the query parameters and so the note content.
- Child tables reference `notes (id, owner_id)` with a composite foreign key, so a row cannot attach to another account's note. `note_links.target_note_id` has no foreign key: a link to a missing note is stored and reads as dangling.
- `note_revisions` is append-only for `coscientist_app`: it has `SELECT` and `INSERT` only.
- The Better Auth tables (`user`, `session`, `account`, `verification`, `passkey`, `rate_limit`) have no RLS.
- A new table gets its `GRANT` to `coscientist_app` in a custom migration. A new tenant table also gets an `owner_id` and the `ownerOnly` policy, which is local to `lib/notes/schema.ts`, and its custom migration sets `FORCE ROW LEVEL SECURITY`.
- A migration that grants to `coscientist_app` fails when the role is missing, and the whole migration run rolls back.

## Production database (PlanetScale Postgres)

The PlanetScale default role has BYPASSRLS, so the app never connects with it.

1. Create the database on Postgres 18.
2. Connect as the default role over the direct port 5432 and run `CREATE ROLE coscientist_app LOGIN PASSWORD '<generated>' NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;`.
3. Set `MIGRATION_DATABASE_URL` to the default role on port 5432 with `sslmode=verify-full`, and run `bun run db:migrate`.
4. Set `DATABASE_URL` to the user `coscientist_app.<branch id>` on port 6432 with `sslmode=verify-full`.

PgBouncer on port 6432 runs in transaction mode, which keeps `set_config(..., true)` inside one server connection. `lib/pg.ts` sets `prepare: false`.

## Notes

- `lib/editor/schema.ts` is the one document schema for the server and the client. It has StarterKit, a link mark whose `href` must pass `isAllowedUri`, the inline `pageLink` node, the block `transclusion` node, and `UniqueID` on the types in `blockTypes`: paragraph, heading, code block, horizontal rule, and transclusion. Quotes, lists, and list items have no ID.
- `readDocument` in `lib/notes/document.ts` validates a document with `nodeFromJSON` and `check()`, requires a `doc` root with no marks and a unique UUID on every node in `blockTypes`, extracts blocks and links, and returns the normalized `doc.toJSON()`. Stored JSON never holds raw HTML.
- Block IDs and the `noteId` of `pageLink` and `transclusion` are lowercase UUIDs, through the `uuid` schema in `lib/editor/schema.ts`. The Postgres `uuid` columns ignore case, and the page looks up link targets by the exact string.
- `readDocument` rejects a node or mark attribute whose value is not a string, a number, a boolean, or null. ProseMirror runs only the `validate` an attribute defines, and the static renderer throws on an object value.
- `readDocument` rejects a text node, or a node or mark attribute string, that holds U+0000, and `saveNoteFn` rejects a title that holds it, because Postgres text and jsonb values cannot hold U+0000. `hasNul` in `lib/notes/document.ts` is the one check.
- `readDocument` rejects a node nested more than 100 levels deep. Text and other inline nodes count at the level of their parent, so a block that saves empty also saves with text. The note page fails in the browser past about 400 levels, and the router state fails to serialize past about 495.
- `saveNote` in `lib/notes/store.ts` is the one write path for an existing note. `createNote` inserts a new note at revision 1 and writes its blocks, links, and first revision through the same `writeContent`. `saveNote` updates the note only when `revision` equals the base revision, sets the new revision to `revision + 1` in SQL from the row it updates, rebuilds `note_blocks` and `note_links`, and appends a revision, all in one transaction. The base revision only selects the row, within the `z.int32()` range of `saveNoteFn`. It answers `saved`, `conflict`, or `not-found`, and fails with `InvalidDocument` before it opens a transaction.
- `writeContent` inserts blocks and links in batches of 1000 rows, because postgres.js rejects a query with 65534 or more parameters.
- `backlinksQuery` and `danglingLinksQuery` in `lib/notes/store.ts` read links. Pages render notes with `renderToReactElement` and a node mapping for `pageLink` and `transclusion`. A link to an existing note shows the target's current title. A link to a missing note shows its stored label followed by "(missing)", or "Missing note" when it has no label.
- `getNotePageFn` runs `viewerMiddleware` before its validator, and the validator answers not found for a malformed note ID. A signed-out request to `/notes/abc` redirects to `/sign-in` like one to `/notes/<uuid>`.

## Auth and mail

- `lib/auth.ts` configures Better Auth. Only `/sign-in/email-otp` creates users, and it marks the email verified. `getViewer` accepts only verified sessions.
- `sendVerificationOTP` sends sign-in codes only. Every other OTP type throws, Better Auth logs the error, and the endpoint answers as it does for an unknown email.
- `disabledPaths` turns off every email OTP path except `/email-otp/send-verification-otp` and `/sign-in/email-otp`. `/email-otp/check-verification-otp` counts attempts with a read and a separate write, so concurrent guesses pass the attempt limit. `/email-otp/reset-password` sets a password with no mail to the account owner. `disabledPaths` does not block direct `auth.api` calls.
- A failed sign-in send answers 503 `OTP_DELIVERY_FAILED` through the `failedSignInSends` hook.
- `lib/auth/otp.ts` holds `otpLength` and `otpMinutes`, the code length and expiry for Better Auth, the email, and the sign-in page. The code field keeps only the digits 0 to 9, up to `otpLength`, and the page sends no code shorter than `otpLength`. `minLength` cannot hold that rule, because Chrome checks it only after a user edit and the field rewrites its value from script. The code step names and signs in the address the code went to. A failed sign-in returns the page to the email step when Better Auth answers `OTP_EXPIRED` or `TOO_MANY_ATTEMPTS`, or when `otpMinutes` have passed since the page sent the request, which is before the server writes the code. Better Auth deletes every expired row on each lookup, so an expired code often answers `INVALID_OTP`. The email field is uncontrolled, and the page reads the address from the submitted form, so text typed before hydration counts. The email form has `method="post"`, so a submit before hydration reloads the page and puts no address in the URL. The email field takes focus when the page returns to the email step, and not on the first load, where focus before hydration invites typing that a reload would drop.
- `hooks.before` rejects an email whose domain or parent domain is on the `disposable-email-domains-js` list with 400 `DISPOSABLE_EMAIL`, unless an account with that email exists.
- The Better Auth rate limiter is on in every environment, with database storage in `rate_limit`. The email OTP paths allow 3 requests per 60 seconds per IPv4 address or IPv6 /64 subnet. The IP comes from Better Auth's default header, `x-forwarded-for`, and only a header with a single valid IP counts. Vercel overwrites `X-Forwarded-For` with the client IP, so a client cannot pick its own bucket there. `x-vercel-forwarded-for` is not read, because Vercel does not document that it replaces a value the client sends. A production build with no usable header puts the request in one bucket per path that every such request shares, as on the local `node-server` build with no proxy. Direct `auth.api` calls skip the limiter.
- `sendEmail` in `lib/mail.ts` is the one mailer. Outside `VERCEL_ENV=production`, it prefixes the subject with `[TEST] ` and opens the body with `This email comes from a TEST setup.`.
- Sign-in and sign-out end with a full document navigation through `location.assign`, so the router cache of the previous account does not survive.
- `noStoreMiddleware` in `src/start.ts` runs first in the request middleware and sets `cache-control: no-store` on the final `Response`: pages, redirects, not-found and error pages, server functions, and `/api/auth/*`. A header set through `setResponseHeader` reaches only 2xx responses, because h3 merges event headers only into ok responses. h3's own JSON 500, built when a handler throws something that is not a `Response`, has no header and no account data. Start's 308 for a protocol-relative path and Nitro's 400 for a malformed percent escape are built before the request middleware runs and have no `cache-control`. The Nitro route rule for `/_build/**` replaces the header with `public, max-age=31536000, immutable` after the middleware, so the not-found page under that path carries it. None of these responses carries account data. The back-forward cache and the HTTP cache keep no account page, so **Back** after sign-out reloads and redirects to `/sign-in`.

## Server code boundary

Code that imports `lib/auth.ts`, `lib/pg.ts`, `lib/env.ts`, `lib/mail.ts`, or `lib/tenant.ts` runs on the server only. Reach it through `createServerFn`, `createServerOnlyFn`, a middleware `.server()` callback, a route `server.handlers` entry, or a Nitro plugin in `server/plugins/`. A plain exported function in a module the client imports keeps the whole server graph in the client bundle. After a build, `grep -l DATABASE_URL .output/public/_build/*.js` prints nothing.

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
