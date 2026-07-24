# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** M0–M2 merged to `main` and pushed (github.com/edlabuschagne/Tweetalig). **M3 Flashcards** built, full battery green (Windows + fresh Linux), independent Verifier **PASS-WITH-NOTES**, and committed on branch `milestone/M3-flashcards` (commit `feat: add M3 Flashcards game` + docs commit). **Awaiting human push + merge.**
- **Executor change (2026-07-24):** Codex usage was exhausted; the executor is now **Claude (Cowork)**. Claude has direct file/shell tools + a desktop bridge to the local repo at `C:\Projects\Tweetalig`. Build/test runs in a Linux cloud rig (the bridge VM can't run the Windows-native toolchain); verified source is written back to the local repo over the bridge; **the human does every `git push` and PR merge** (no credentials leave the machine).
- **Next action (human):** push `milestone/M3-flashcards` and open/merge its PR (M3 is a `needs-human-check` gate; feel already approved from screenshots). Then Claude continues M4→M7 on the same branch.
- **Run plan:** Run A = M0–M7 + M10 (learning app + packaging). Run B = M8–M9 (delight layer). Current run: **M3 → M7** (stop on any FAIL or the next human-check gate, which is M10 packaging).

## Decisions on record
- Stack: Capacitor + React + Vite + TypeScript + Tailwind. Executor: **Claude (Cowork)** as of 2026-07-24 (was Codex).
- Audio: reuse v1's 164 edge-tts MP3s (82 af + 82 en) + the v1 curriculum (`lessons.ts`). Voice upgrade PARKED.
- Autonomous Mode: Verifier-as-gate via a fresh independent agent on each milestone diff; GitHub branch protection + human push/merge is the deterministic guard for this private repo.
- Navigation is local React state (no React Router) — a lean choice made in M2, carried forward.
- Git author identity: Edward Labuschagne's GitHub noreply. Capacitor 8.4.2. `@capacitor/preferences@8.0.1` approved for local persistence.
- Bridge quirk (2026-07-24): the desktop bridge blocks file *delete* but allows create/overwrite/rename; git commits work if stray `.lock` files are cleared first. Claude handles this. A throwaway `_to_delete/` folder plus stray files (`_wtest.txt`, `_dtest/`) were left by capability probes — **the human can delete these**; they are never committed.

## Debt ledger (cumulative across the run)
- M3-note-1 (low): `verification-shots/M3/M3-1-audio-request.json` is test-written, not a raw network dump; the live `waitForResponse` assertion is the real proof. Cosmetic.
- M3-note-2 (low): Flashcards reports a fixed score of 100 (no wrong answers in a flip game); real per-game scoring lands in M7.
- M3-note-3 (low): `captureM2` skips a screenshot when the file already exists — M2 shots won't refresh on future UI drift (assertions unaffected).

## Open blockers
_(none)_

## Milestone log
- **M0 Bootstrap — independent Verifier PASS; human-approved and merged (2026-07-23).** Skeleton, toolchain, reused assets wired, Capacitor shell. `verification-shots/M0/`.
- **M1 Offline audio — PASS after a human-approved deterministic-LF repair; merged (2026-07-23).** Single-source `audio/player.ts`, offline bundled playback. `verification-shots/M1/`, `M1-repair/`.
- **M2 Home/navigation — independent Verifier PASS; merged (2026-07-23).** Name entry + Preferences persistence, 10-lesson LessonSelect with level locks, direction toggle, four game tiles. `verification-shots/M2/`.
- **M3 Flashcards — independent Verifier PASS-WITH-NOTES; committed on `milestone/M3-flashcards`, awaiting human push+merge (2026-07-24).**
  - Executor: Claude (Cowork). Built only M3 scope: flip-card game (front = "from" word; flip reveals "to" translation + emoji and auto-plays target-language audio; replay; Next/Finish), shared `GameShell`, score-only `Results`, `GamePlay` host, GameSelect Flashcards tile now live.
  - Battery: build, lint, format:check, 16 unit, 9 Playwright — all PASS; captured in `verification-shots/M3/verify.txt`. Reproduced green in a fresh Linux container.
  - Observable outcomes: `M3-1-card-front/back`, `M3-2-results`, `M3-3-af-en`, `M3-4-keyboard-focus` — all correct, no console errors.
  - Scope/security: no other games, no delight layer, no new dependency, no backend/network/TTS. npm audit clean.
  - Independent gate: **PASS-WITH-NOTES** (3 low-severity cosmetic notes above, no blocking findings). Report: `verification-shots/M3/verifier-gate-report.md`. Human approved the feel from screenshots.

## Run summary (M0–M3)
- M0–M2 merged and live on `main`. M3 built + verified, committed, awaiting human merge.
- Acceptance ledger: M0–M3 entries all `passes: true` with cited evidence.
- Cumulative debt: 3 low-severity cosmetic notes. Open blockers: none.
