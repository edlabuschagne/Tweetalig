# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** Repository created and connected. No milestone built. Forge guard revision is in progress on `codex/forge-local-guard`.
- **Next action (human):** review and merge the Forge guard PR, then kick off **Milestone 0**.
- **Run plan:** Run A = M0–M7 + M10 (the learning app + packaging). Run B = M8–M9 (delight layer), started only after Run A ships.
- **Suggested first run length:** "build through M2, then stop" — watch the loop + Verifier behave before letting it run further.

## Decisions on record
- Stack: Capacitor + React + Vite + TypeScript + Tailwind (reasoned in planning). Executor: Codex (swappable).
- Audio: **reuse v1's 170 edge-tts MP3s** + the v1 curriculum (`lessons.ts`). Voice upgrade is PARKED (asset swap later).
- Autonomous Mode: Verifier-as-gate via a separate fresh Codex task on each PR diff; restricted workspace + repository-local Git hooks + branch/PR = the deterministic guard for this private GitHub Free repository.
- Git history author identity was corrected with explicit human approval on 2026-07-23; reachable commits now use Edward Labuschagne's GitHub noreply identity.
- Fish Audio rejected (no documented Afrikaans; free tier bans commercial use).

## Debt ledger (cumulative across the run)
_(none yet)_

## Open blockers
_(none)_

## Milestone log
_(empty — M0 not started)_
