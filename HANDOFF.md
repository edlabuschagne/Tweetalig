# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** Milestone 0 was human-approved and merged. Milestone 1’s independent Verifier returned **FAIL** on PR #4; the run is stopped.
- **Next action (human):** do not merge PR #4. Review the line-ending blocker below and explicitly authorize a repair attempt if desired.
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
- **M1 Verifier FAIL — deterministic format check (2026-07-23):** in a clean Windows checkout with `core.autocrlf=true`, Git materializes 13 unchanged LF files as CRLF while Prettier requires LF, so independent `npm run format:check` exits 1. Build, lint, 7 unit tests, 3 Playwright tests, guard, all five M1 acceptance criteria, and visual evidence otherwise pass. Exact report: `verification-shots/M1/verifier-gate-report.md`. No repair was attempted after the FAIL.

## Milestone log
- **M0 Bootstrap — independent Verifier PASS; human-approved and merged (2026-07-23).**
  - Guard note: restricted Codex workspace; branch `milestone/M0-bootstrap`; `core.hooksPath=.githooks`; `scripts/verify-forge-guard.ps1` PASS.
  - Battery: build, lint, format check, unit test, and Playwright all PASS; aggregate `npm run verify` PASS. Captured in `verification-shots/M0/`.
  - Observable outcome: `M0-3-placeholder-home.png` shows the title “Tweetalig”; Playwright captured zero console/page errors.
  - Asset integrity: 82 English + 82 Afrikaans curriculum mappings resolve to bundled MP3 files; reused `src/data/lessons.ts` and `public/audio/**` are unchanged.
  - Android: Capacitor 8.4.2 shell generated; `npx cap sync` PASS; `android/` exists.
  - Security/debt: npm audit reports zero vulnerabilities; no secrets/network core calls introduced; no open `forge-debt` entries.
  - Independent gate: **PASS**, no notes or blocking findings. Exact report: `verification-shots/M0/verifier-gate-report.md`.
- **M1 Core data + offline audio playback — independent Verifier FAIL; stopped (2026-07-23).**
  - Guard note: restricted workspace; branch `milestone/M1-audio`; `core.hooksPath=.githooks`; `scripts/verify-forge-guard.ps1` PASS. No access to production, secrets, or billing.
  - Built only M1 scope: single-source `src/audio/player.ts` slug/path/play/stop behavior and a development-only lesson audio test screen. No games, progress storage, live TTS, runtime network feature, or dependency was added.
  - Battery: build, lint, format check, 7 unit tests, and 3 Playwright tests PASS; aggregate `npm run verify` PASS. Capacitor sync and npm audit PASS. Captured in `verification-shots/M1/`.
  - Observable outcomes: exact English/Afrikaans paths captured in `M1-3-audio-requests.json`; offline-after-load playback captured in `M1-5-offline-network.json`; both screenshots show successful playback with no error.
  - Asset integrity: all 164 curriculum mappings resolve; `src/data/lessons.ts` and `public/audio/**` remain unchanged.
  - Security/debt: npm audit reports zero vulnerabilities; no `forge-debt` markers; cumulative debt remains zero.
  - Independent gate: **FAIL** because a fresh Windows checkout fails `npm run format:check` on CRLF-materialized unchanged files. All M1 functional criteria passed. No repair was attempted after the verdict.
