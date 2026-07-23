# Builder Self-Check — Milestone 0: Bootstrap

This is the executor's self-check, not the independent Verifier verdict.

## Check 1 — Acceptance criteria

- **M0-1 PASS:** `verification-shots/M0/build.txt` records a successful TypeScript and Vite production build.
- **M0-2 PASS:** `lint.txt`, `format-check.txt`, `test.txt`, and `e2e.txt` record a green deterministic battery. `verify.txt` records the aggregate `npm run verify` pass.
- **M0-3 PASS:** `M0-3-placeholder-home.png` shows the “Tweetalig” heading; `e2e.txt` records the Playwright assertion and zero console/page errors.
- **M0-4 PASS:** `tests/unit/audio-assets.test.ts` checks 164 paths derived from all 82 bilingual curriculum entries; `test.txt` records the pass.
- **M0-5 PASS:** `cap-sync.txt` records a successful Capacitor sync and the generated `android/` project is present.

## Check 2 — Injection and unsafe construction

PASS. The M0 app renders a static React heading. No HTML injection, evaluation, dynamic user path, or user input exists.

## Check 3 — Scope and DO-NOT-BUILD

PASS. The app contains only the title placeholder. No routes, additional screens, game logic, progress storage, playback engine, or runtime network feature was added.

## Check 4 — Regression and source assets

PASS. This is the bootstrap baseline. `src/data/lessons.ts` and `public/audio/**` are unchanged; the new unit test reads them without rewriting them.

## Check 5 — Never-lean floor

PASS for M0's surface. `.gitignore` excludes environment and keystore files; `npm-audit.txt` reports zero vulnerabilities; no core runtime network call or analytics exists; the placeholder uses a semantic level-one heading. Input and progress checks are not applicable because M0 intentionally has neither.

## Check 6 — Tripwires

PASS. `guard.txt` records the active non-main branch and passing local guard probes. Runtime dependency additions and the Capacitor 8 architecture update received explicit human approval and are recorded in `HANDOFF.md`.

## Check 7 — Debt ledger

PASS. No `forge-debt:` markers were introduced; the cumulative debt ledger remains empty.

## Check 8 — Observable outcome

PASS. `M0-3-placeholder-home.png` was opened and visually checked: the page renders the required “Tweetalig” title without an error or empty state.
