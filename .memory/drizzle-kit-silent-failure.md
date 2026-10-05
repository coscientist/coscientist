---
name: drizzle-kit-silent-failure
description: drizzle-kit migrate exits 1 with no error message when the error-print patch does not match the installed version
metadata:
  type: project
---

`drizzle-kit migrate` catches a failed migration with `terminal.reject(err2); process.exit(1)` in `node_modules/drizzle-kit/bin.cjs` and prints nothing but the spinner. `patches/drizzle-kit@<version>.patch` adds `console.error(err2);` after that call, and `package.json` pins `drizzle-kit` to the same version.

After a `drizzle-kit` bump, run `bun patch drizzle-kit`, add `console.error(err2);` after `terminal.reject(err2);` in `node_modules/drizzle-kit/bin.cjs`, run `bun patch --commit node_modules/drizzle-kit`, delete the old patch file, and pin the new exact version. Confirm with a migration that grants to a missing role: the output names `role "<name>" does not exist`.
