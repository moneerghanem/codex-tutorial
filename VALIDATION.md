# Validation record

Verified on 14 October 2026. This record distinguishes observed checks from teaching illustrations.

## Content and sources

- Inspected the original repository: only README and placeholder index.html existed. No other user work was replaced.
- Read current official OpenAI documentation for CLI, commands, authentication, Windows/WSL, IDE, AGENTS.md, skills, best practices, Docs MCP, subagents, hooks, worktrees and non-interactive mode. Followed redirects to current ChatGPT Learn pages.
- Read official GitHub Pages hosting/publishing documentation and Git tutorial/revert guidance.
- CLI practical checks: `codex --version`, `codex --help`, `codex login --help`, `codex exec --help`; installed version `0.162.0-alpha.17.2`. This is a prerelease, not a required learner version. Help succeeded with local temporary-directory warnings.
- Twelve curriculum lessons, seven counter exercises, command/reference entries, troubleshooting causes/diagnostics/recovery, glossary and independent-project disclosure are present. No coming-soon lessons.
- Illustrative conversations, interface artwork and diffs are labelled. No fabricated actual Codex execution evidence.

## Automated checks

- Static build succeeds using Node v24.15.0; no external dependencies.
- `node scripts/check.mjs`: 22 output HTML pages, 694 relative links/assets/fragments, unique IDs, language/title/H1 checks, lesson coverage, counter boundaries/state sequences, and a secret-pattern scan.
- Completed `node check.mjs`: passes state-transition tests; starter check intentionally fails at Reset until repaired.
- Both ZIP downloads opened with Python zipfile; all five files listed and CRC integrity checks passed.
- Denied/corrupt storage and missing clipboard tested in an isolated DOM fixture: script bootstraps and reports clipboard failure honestly. This is not a full browser privacy-mode test.

## Observed browser checks

- Local HTTP preview uses `/codex-tutorial/`, matching the GitHub project subpath.
- Desktop homepage and lesson layouts inspected visually at the normal 1280px viewport; mobile homepage and lesson inspected at 390×844. No horizontal page overflow observed in those views.
- Search found both resume entries; combined interface filter produced zero matches; category/experience filters produced the expected review entries.
- Copy button reported successful clipboard write. Failure feedback separately exercised in fixture.
- Prompt workshop incorrect/correct responses, next-example control, and completion-criteria example feedback checked.
- Walkthrough next/back controls, reload persistence, final completion, lesson progress persistence and reset checked.
- Both answers in the diff exercise produced explanatory feedback; transcript annotations expand.
- Windows/macOS/Linux setup panels switch correctly.
- Troubleshooting symptom selection narrowed to one guide; glossary search narrowed to one matching term.
- Starter download completed in the browser. Starter demo reproduced unchanged value after Reset and negative count. Completed demo passed state sequence and keyboard Enter/Space activation; Tab moved focus with a visible solid outline.
- 404 page contains repository-base recovery links. Direct lesson visits and refreshes succeeded.
- Reduced-motion CSS disables smooth scrolling/transitions; no continuous animation is used.

## Limits

- Installers were not executed on Windows, macOS and Linux; account sign-in variants and every slash command were not interactively exercised.
- No live agent task or actual skill run is claimed by the illustrative transcripts. Skills lessons include a learner test procedure, not fabricated run results.
- No comprehensive assistive-technology audit, real screen-reader session, cross-browser/device matrix or complete WCAG certification. Semantic structure, labelled controls, focus, keyboard operation and responsive layouts were checked as described.
- External sources were opened during research; future availability, account entitlements, policies and changing commands require periodic re-verification.
- A secret-pattern scan reduces accidental disclosure risk but is not an exhaustive security audit.
