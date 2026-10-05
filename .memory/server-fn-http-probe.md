---
name: server-fn-http-probe
description: How to call a TanStack Start server function over HTTP in an end-to-end probe, and why its status code is always 200
metadata:
  type: project
---

A server function answers HTTP 200 when its handler throws an error, `notFound()`, or `redirect()`. The body carries the outcome: `$TSR/Error` for an error, `isNotFound` for a missing note, and `isSerializedRedirect` with `"to":"/sign-in"` for a missing session. A probe reads the body, never the status.

A probe calls `/_serverFn/<id>` with the header `x-tsr-serverFn: true` and an `Origin` that matches the app, because the CSRF middleware in `src/start.ts` answers 403 otherwise. The payload is `JSON.stringify(await toJSONAsync({ data }))` from `seroval`: the POST body for a POST function, or `?payload=` for a GET function. The `<id>` of each function is the key whose `functionName` is `<export>_createServerFn_handler` in `.output/server/_ssr/ssr.mjs` after `bun run build`.
