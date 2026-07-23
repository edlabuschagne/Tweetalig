# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** Planning complete. Repo not yet created. No milestone built.
- **Next action (human):** create the GitHub repo on your personal account, drop these docs in, then kick off **Milestone 0** with Codex (see `START_HERE_Codex_and_Android.md`).
- **Run plan:** Run A = M0–M7 + M10 (the learning app + packaging). Run B = M8–M9 (delight layer), started only after Run A ships.
- **Suggested first run length:** "build through M2, then stop" — watch the loop + Verifier behave before letting it run further.

## Decisions on record
- Stack: Capacitor + React + Vite + TypeScript + Tailwind (reasoned in planning). Executor: Codex Cloud (ChatGPT app).
- Audio: **reuse v1's 170 edge-tts MP3s** + the v1 curriculum (`lessons.ts`). Voice upgrade is PARKED (asset swap later).
- Autonomous Mode: Verifier-as-gate via a separate fresh Codex task on each PR diff; branch/PR + isolated container = the deterministic guard.
- Fish Audio rejected (no documented Afrikaans; free tier bans commercial use).

## Debt ledger (cumulative across the run)
_(none yet)_

## Open blockers
_(none)_

## Milestone log
_(empty — M0 not started)_
