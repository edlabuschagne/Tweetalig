# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** PR #4 was accidentally merged after the M1 Verifier FAIL. The explicitly approved line-ending repair is built and self-verified on `milestone/M1-format-repair`; its independent repair gate is pending.
- **Next action:** open the M1 corrective PR and run a fresh independent Forge Verifier before considering M1 complete or starting M2.
- **Run plan:** Run A = M0–M7 + M10 (the learning app + packaging). Run B = M8–M9 (delight layer), started only after Run A ships.
- **Suggested first run length:** "build through M2, then stop" — watch the loop + Verifier behave before letting it run further.

## Decisions on record
- Stack: Capacitor + React + Vite + TypeScript + Tailwind (reasoned in planning). Executor: Codex (swappable).
- Audio: **reuse v1's 164 edge-tts MP3s** + the v1 curriculum (`lessons.ts`). Voice upgrade is PARKED (asset swap later).
- Autonomous Mode: Verifier-as-gate via a separate fresh Codex task on each PR diff; restricted workspace + repository-local Git hooks + branch/PR = the deterministic guard for this private GitHub Free repository.
- Git history author identity was corrected with explicit human approval on 2026-07-23; reachable commits now use Edward Labuschagne's GitHub noreply identity.
- Capacitor was updated from 6 to 8.4.2 with explicit human approval on 2026-07-23 because Capacitor 6 required a critically vulnerable `tar` version; the final npm audit reports zero vulnerabilities.
- The human explicitly authorized the M1 line-ending repair after accidentally merging PR #4 on 2026-07-23.
- Fish Audio rejected (no documented Afrikaans; free tier bans commercial use).

## Debt ledger (cumulative across the run)
_(none yet)_

## Open blockers
- **M1 repair gate pending (2026-07-23):** the original FAIL was traced to `.gitattributes` allowing CRLF checkout materialization under `core.autocrlf=true`. The approved repair enforces LF for tracked text. Builder verification is green; a fresh independent gate is still required.

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
- **M1 deterministic line-ending repair — builder PASS; independent repair gate pending (2026-07-23).**
  - Branch: `milestone/M1-format-repair`, created from the accidentally merged PR #4 commit; local Forge guard PASS.
  - Scope: `.gitattributes` only now enforces `eol=lf` for detected text files. No application code, dependency, curriculum, audio asset, secret, or security configuration changed.
  - Battery: aggregate `npm run verify` PASS — build, lint, format check, 7 unit tests, and 3 Playwright tests. npm audit and guard PASS. Captured in `verification-shots/M1-repair/`.
  - Debt: none.
