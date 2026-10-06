# Memory: coscientist

- A TanStack Start server function answers HTTP 200 when its handler throws an error, `notFound()`, or `redirect()`, so a probe reads the body, never the status; the probe recipe is in [[e2e_probes]].
- A push that aborts with `Can't find lefthook in PATH` and `ERROR: Operation is aborted due to lefthook settings.` needs `bun install` in the checkout that pushes, because every worktree shares one hooks directory and the hook reads the `node_modules` of the pushing checkout.
- The owner brief behind `docs/research-plan.md` is not in the repository; read [[research_brief]] before plan or model work, and [[research_plan]] before editing the plan.

## Index

- [[auth]]
- [[database]]
- [[e2e_probes]]
- [[framework_apis]]
- [[git_workflow]]
- [[lint]]
- [[notes_editor]]
- [[qa_interns]]
- [[research_brief]]
- [[research_plan]]
