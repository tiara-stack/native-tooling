## Repository workflow

- `main` is the trunk. For a Linear issue, use its provided branch name; otherwise use `<username>/<lowercase-kebab-case-feature-slug>`.
- Use Graphite to create or track branches and submit PRs. Keep commits coherent and use Conventional Commit subjects (`type(scope): summary`); use the package name as the scope when it is clear.
- Submit with `gt submit --no-interactive` after local review. Choose validation from the root scripts in `package.json` and `.github/workflows/ci.yml`, `publish.yml`, and `vite-plus.yml`.
- For this monorepo's own tooling, use workspace source. Use built packages only in tests.
- Run local reviewers in the configured order: Open Code Review delegation, then CodeRabbit CLI. For OCR, run `ocr delegate preview --from "$BASE" --to HEAD --format json` and `ocr delegate preview --format json`, then fetch rules with `ocr delegate rule --format json <paths>`. Inspect every listed diff and report total, reviewed, skipped, and coverage. Missing rules, command failures, skipped reviewable files, or incomplete coverage mean the review did not pass.
- Run local CodeRabbit with `coderabbit review --agent --base "$(gt trunk)" --include-untracked`. After repairs, repeat until a successful run reports no new valid findings. A failed command is not a clean review.
- Keep the PR in draft until required checks and hosted CodeRabbit review pass on the current head; mark it ready only after those gates pass. Hosted review uses GitHub bot `coderabbitai[bot]`. Request or rerun it with `@coderabbitai review` and confirm its result covers the current PR head.
- `to merge` is Graphite merge-queue admission. Apply it only after local review, required CI checks, and hosted CodeRabbit review pass for the current PR head. Do not merge PRs directly.
- In ticket-coordinator runs, include `$implement`'s `/code-review` step before queue admission; stop if the step is unavailable or fails.

## Agent skills

### Issue tracker

Work items go to the Linear `tiara-stack` team backlog. No project-specific routing is configured. See `docs/agents/issue-tracker.md`.

### Triage labels

Use `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Use the single-context layout. Read root `CONTEXT.md` and `docs/adr/` when present. See `docs/agents/domain.md`.
