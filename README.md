# WTF is Codex?

An independent educational website for an Agentic Programming course. CLI-first lessons, guided practice, a command finder, troubleshooting, glossary and a tiny counter lab. Not official OpenAI documentation.

Live: https://moneerghanem.github.io/codex-tutorial/

## Run and build

Node.js 18+ is sufficient for the local build (CI uses Node 22). There are no npm dependencies and no installation step.

```
npm run build
npm test
npm run dev
```

Preview: http://127.0.0.1:4173/codex-tutorial/ . Stop with Ctrl+C. Static pages also render without a server; use HTTP for clipboard and normal browser testing.

## Architecture and editing

- `content/lessons.json`: lesson order, metadata, prerequisites, source IDs.
- `content/*.html`: authored lesson bodies, kept separately from layout.
- `content/commands.json`: searchable reference entries.
- `content/troubleshooting.json`: symptom/cause/diagnosis/recovery entries.
- `content/sources.json`: official reference register and scope.
- `scripts/build.mjs`: shared layouts, navigation and static page generation.
- `scripts/practice.mjs`: counter variants and deterministic ZIP downloads.
- `assets/app.js`, `assets/style.css`: progressive browser interactions and visual design.
- `learn/`, reference directories, root `index.html`/`404.html`, `downloads/` and `practice-projects/`: generated deployment output, committed to Git.

For an update, edit source content or templates, run build and checks, then commit source **and generated output**. Reopen official sources before changing technical claims; update dates in the build template and relevant metadata. The verification date reflects documentation review, not a guarantee across every version/account/OS. See `VALIDATION.md` for observed checks and limits.

## GitHub Pages deployment

Keep the existing Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Generated HTML/CSS/JS is already committed; `.nojekyll` prevents Jekyll transformation. Pushing a reviewed update to main publishes it. No hosting migration, backend, secrets or custom runtime is needed. The validation workflow regenerates output and fails if committed generated files are stale; GitHub's branch Pages workflow handles deployment.

Links are relative under `/codex-tutorial/`; lessons have actual `.html` files and reference sections have `index.html`. Direct visits and refreshes do not need SPA rewrites. `404.html` uses the explicit repository base path; if the repository name changes, update that path in the build template and local server. No symlinks are used.

Official hosting references: [Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Practice

Download `downloads/counter-starter.zip` for deliberately broken Reset/lower-bound behavior; `counter-completed.zip` is the comparison solution. Both contain a real `check.mjs` that can run with Node. The starter is expected to fail until repaired. Browser rendering and accessibility still require manual checks.

## Privacy

No analytics, login, live AI calls or external fonts. Local storage holds lesson progress and walkthrough position. Storage failure falls back to in-page state. GitHub hosting has its own request logging.
