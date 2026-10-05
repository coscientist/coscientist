---
name: lefthook-shared-hooks
description: Worktrees share one git hooks directory, so the lefthook pre-push hook needs lefthook installed in whichever checkout pushes
metadata:
  type: project
---

Every worktree of this repository uses the hooks directory of the common git directory. `lefthook install`, which `bun install` runs, writes `pre-push` there. The hook calls the lefthook binary of the checkout that installed it by absolute path, then the `node_modules` of the checkout that pushes.

When a push aborts with `Can't find lefthook in PATH` and `ERROR: Operation is aborted due to lefthook settings.`, run `bun install` in the checkout that pushes. Never push with `LEFTHOOK=0` or `--no-verify`.
