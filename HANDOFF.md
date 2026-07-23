# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** Milestone 0 is built and self-verified on `milestone/M0-bootstrap`; independent Verifier pending.
- **Next action:** open the M0 PR and run the independent fresh-context Verifier. M0 is `needs-human-check`, so stop for human review even if the Verifier passes.
- **Run plan:** Run A = M0–M7 + M10 (the learning app + packaging). Run B = M8–M9 (delight layer), started only after Run A ships.
- **Suggested first run length:** "build through M2, then stop" — watch the loop + Verifier behave before letting it run further.

## Decisions on record
- Stack: Capacitor + React + Vite + TypeScript + Tailwind (reasoned in planning). Executor: Codex (swappable).
- Audio: **reuse v1's 164 edge-tts MP3s** + the v1 curriculum (`lessons.ts`). Voice upgrade is PARKED (asset swap later).
- Autonomous Mode: Verifier-as-gate via a separate fresh Codex task on each PR diff; restricted workspace + repository-local Git hooks + branch/PR = the deterministic guard for this private GitHub Free repository.
- Git history author identity was corrected with explicit human approval on 2026-07-23; reachable commits now use Edward Labuschagne's GitHub noreply identity.
- Capacitor was updated from 6 to 8.4.2 with explicit human approval on 2026-07-23 because Capacitor 6 required a critically vulnerable `tar` version; the final npm audit reports zero vulnerabilities.
- Fish Audio rejected (no documented Afrikaans; free tier bans commercial use).

## Debt ledger (cumulative across the run)
_(none yet)_

## Open blockers
_(none)_

## Milestone log
- **M0 Bootstrap — builder self-check PASS, Verifier pending (2026-07-23).**
  - Guard note: restricted Codex workspace; branch `milestone/M0-bootstrap`; `core.hooksPath=.githooks`; `scripts/verify-forge-guard.ps1` PASS.
  - Battery: build, lint, format check, unit test, and Playwright all PASS; aggregate `npm run verify` PASS. Captured in `verification-shots/M0/`.
  - Observable outcome: `M0-3-placeholder-home.png` shows the title “Tweetalig”; Playwright captured zero console/page errors.
  - Asset integrity: 82 English + 82 Afrikaans curriculum mappings resolve to bundled MP3 files; reused `src/data/lessons.ts` and `public/audio/**` are unchanged.
  - Android: Capacitor 8.4.2 shell generated; `npx cap sync` PASS; `android/` exists.
  - Security/debt: npm audit reports zero vulnerabilities; no secrets/network core calls introduced; no open `forge-debt` entries.
