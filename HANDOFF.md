# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** M0–M2 run complete. M2 has an independent **PASS** with no notes or blockers on PR #6; stopped at the human batch-review gate.
- **Next action (human):** review and merge PR #6 if satisfied. No M3 work has started.
- **Run plan:** Run A = M0–M7 + M10 (the learning app + packaging). Run B = M8–M9 (delight layer), started only after Run A ships.
- **Suggested first run length:** "build through M2, then stop" — watch the loop + Verifier behave before letting it run further.

## Decisions on record
- Stack: Capacitor + React + Vite + TypeScript + Tailwind (reasoned in planning). Executor: Codex (swappable).
- Audio: **reuse v1's 164 edge-tts MP3s** + the v1 curriculum (`lessons.ts`). Voice upgrade is PARKED (asset swap later).
- Autonomous Mode: Verifier-as-gate via a separate fresh Codex task on each PR diff; restricted workspace + repository-local Git hooks + branch/PR = the deterministic guard for this private GitHub Free repository.
- Git history author identity was corrected with explicit human approval on 2026-07-23; reachable commits now use Edward Labuschagne's GitHub noreply identity.
- Capacitor was updated from 6 to 8.4.2 with explicit human approval on 2026-07-23 because Capacitor 6 required a critically vulnerable `tar` version; the final npm audit reports zero vulnerabilities.
- The human explicitly authorized the M1 line-ending repair after accidentally merging PR #4 on 2026-07-23.
- The human explicitly approved `@capacitor/preferences@8.0.1` for M2 local first-name persistence on 2026-07-23.
- Fish Audio rejected (no documented Afrikaans; free tier bans commercial use).

## Debt ledger (cumulative across the run)
_(none yet)_

## Open blockers
_(none)_

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
- **M1 deterministic line-ending repair — independent Verifier PASS (2026-07-23).**
  - Branch: `milestone/M1-format-repair`, created from the accidentally merged PR #4 commit; local Forge guard PASS.
  - Scope: `.gitattributes` only now enforces `eol=lf` for detected text files. No application code, dependency, curriculum, audio asset, secret, or security configuration changed.
  - Battery: aggregate `npm run verify` PASS — build, lint, format check, 7 unit tests, and 3 Playwright tests. npm audit and guard PASS. Captured in `verification-shots/M1-repair/`.
  - Debt: none.
  - Independent gate: **PASS**, no notes or blocking findings. A fresh clone at exact repair commit `da060872e2800f4bf038cb4695e419991ad71a36` with `core.autocrlf=true` materialized tracked text as LF and passed the full battery. Exact report: `verification-shots/M1-repair/verifier-gate-report.md`.
- **M2 Home/navigation shell — independent Verifier PASS (2026-07-23).**
  - Guard/debt gate: branch `milestone/M2-navigation`; local Forge guard PASS; cumulative debt zero.
  - Built only M2 scope: validated first-name Home with local Preferences persistence, progress summary, 10-lesson LevelSelect with fresh-install locks, EN→AF/AF→EN direction controls, and four non-functional GameSelect tiles.
  - Approved dependency: `@capacitor/preferences@8.0.1`; Capacitor sync found and registered the Android plugin. No React Router or other dependency was added.
  - Battery: aggregate `npm run verify` PASS — build, lint, format check, 16 unit tests, and 6 Playwright tests. npm audit and guard PASS. Captured in `verification-shots/M2/`.
  - Observable outcomes: empty and returning Home, all 10 lessons with Levels 2–3 locked, both direction states, and four game tiles are captured in `verification-shots/M2/`.
  - Scope/security/debt: no game logic, scoring, mascot/XP/streak, parent guide, backend, auth, analytics, runtime external network call, or debt marker was added. Curriculum and bundled audio assets remain unchanged.
  - Independent gate: **PASS**, no notes or blocking findings. Fresh Windows checkout and full battery independently passed. Exact report: `verification-shots/M2/verifier-gate-report.md`.

## M0–M2 run summary
- M0 Bootstrap: independently PASS; human-approved and merged.
- M1 Offline audio: all criteria PASS after the human-approved deterministic-LF repair; corrective PR #5 merged.
- M2 Home/navigation: independently PASS on PR #6; awaiting human merge.
- Acceptance ledger: M0, M1, and M2 entries are all `passes: true` with cited evidence.
- Cumulative debt: zero. Open blockers: none. Run boundary reached; M3 was not started.
