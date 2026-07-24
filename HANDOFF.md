# HANDOFF.md — Tweetalig v2

> Session state, refreshed at every milestone end. The human's batch-review artifact. Read this at the start of every session.

## Current state
- **Status:** M0–M2 merged to `main` and pushed (github.com/edlabuschagne/Tweetalig). **M3–M7** (Flashcards, Listen & Choose, Match Pairs, Spell It, Progress/scoring/level-unlock) all built, full battery green (fresh Linux rig), independent Verifier PASS, committed on branch `milestone/M3-flashcards`. **Awaiting human push + merge.** **Run A feature build is COMPLETE** — only M10 packaging (deploy + APK, human-driven) remains. See `tweetalig-v2/RESUME_Claude_executor.md`.
- **Branch `milestone/M3-flashcards` commits (ahead of main):** M3 feat+docs, M4 feat+docs, M5 feat+docs, M6 feat+docs, M7 feat+docs (`6b9d885` feat, docs pending this commit). Push this branch and open ONE PR into main; or cherry-review per commit.
- **Cleanup for the human (bridge can't delete):** in the repo root, delete the throwaway folder `_to_delete/` and stray files `_wtest.txt`, `_dtest/`. Also harmless orphaned `tmp_obj_*` files may sit in `.git/objects/**` (a `git gc` clears them). None are tracked/committed.
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
- M4-note-1 (low): `buildChoices` (ListenChoose) doesn't dedupe distractors — relies on each lesson having ≥4 distinct translations (true today). A future lesson with a duplicate translation could cause a React `key` collision. Revisit if the curriculum grows duplicates.
- M7-note-1 (low, design): level unlock is **per-direction** and averages over **played** prior-level lessons only (unplayed excluded). This is more lenient than a literal reading of ARCHITECTURE.md ("average best across Level N-1 lessons") — one Level-1 lesson at ≥40 unlocks Level 2. It satisfies every M7 acceptance criterion, is unit-pinned, and preserves the M2 fresh-install-locked invariant. Tighten to "average across ALL prior-level lessons" only if Edward wants stricter gating (kids' app leans forgiving).

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

- **M4 Listen & Choose — independent Verifier PASS; committed on `milestone/M3-flashcards`, awaiting human push+merge (2026-07-24).**
  - Executor: Claude (Cowork). Hear the target word (gesture-safe auto-focused "Hear the word" button), pick from 4 shuffled choices (correct + 3 lesson distractors); correct→positive, wrong→corrective feedback revealing the answer; score = round(correct/total×100) to Results.
  - Shared-pattern changes (additive, M3 regression green): `GameShell` optional `unitLabel`; `GameSelect` launches any game in `builtGames`; `GamePlay` dispatches by `GameId`; `App` tracks `selectedGame`; `Results` completion line game-neutral.
  - Battery: build, lint, format:check, 16 unit, 12 e2e — all PASS. `verification-shots/M4/`. Hardened a Home loading-race flake; 3× stable.
  - Independent gate: **PASS** (report `verification-shots/M4/verifier-gate-report.md`).

- **M5 Match Pairs — independent Verifier PASS; committed on `milestone/M3-flashcards`, awaiting human push+merge (2026-07-24).**
  - Executor: Claude (Cowork). Two-column tap-to-pair grid (6 pairs, first 6 lesson words, columns shuffled independently). Tap a "from" word then its "to" match → both lock emerald with aria-hidden ✓ and disable; mismatch flags both red with ✗ + "Not a match — try again" and clears on the next tap (no timers — deterministic). Score = round(pairCount/(pairCount+mismatches)×100) to Results; both directions.
  - Files: `src/games/MatchPairs.tsx` (new); `GamePlay` `case "match"`; `GameSelect` builtGames += `"match"`. No audio/network (not required by any criterion — leaner than M3/M4).
  - Battery: build, lint (0 warnings after removing two redundant eslint-disables), format:check, 16 unit, 15 e2e (12 prior regression + 3 new M5) — all PASS. `verification-shots/M5/`.
  - Independent gate: **PASS**, no blocking findings, no new debt (report `verification-shots/M5/verifier-gate-report.md`). Verifier re-ran the battery itself.

- **M6 Spell It — independent Verifier PASS; committed on `milestone/M3-flashcards`, awaiting human push+merge (2026-07-24).**
  - Executor: Claude (Cowork). Type the "to" translation of the shown "from" word (+ gesture-safe "Hear the word" button). Forgiving checker `src/games/spell-check.ts` (`normalizeSpelling`/`isSpellingCorrect`): lowercase, fold accents, drop apostrophes, strip non-letter/space, collapse whitespace, trim — keeps spaces for multi-word phrases. Wrong answers reveal the correct spelling. Score = round(correct/total×100).
  - Files: `spell-check.ts` + unit test (8 cases); `SpellIt.tsx` (new, guarded input: maxLength 40, empty-submit ignored, Check disabled while empty); `GamePlay` `case "spell"`; `GameSelect` builtGames += `"spell"`.
  - Battery: build, lint (clean), format:check, 24 unit (16 prior + 8 new), 18 e2e (15 prior + 3 M6) — all PASS. `verification-shots/M6/`.
  - Independent gate: **PASS**, no blocking findings, no new debt (report `verification-shots/M6/verifier-gate-report.md`). Verifier re-ran the battery.

- **M7 Progress/scoring/level-unlock — independent Verifier PASS; committed on `milestone/M3-flashcards`, awaiting human push+merge (2026-07-24).**
  - Executor: Claude (Cowork). `src/storage/progress.ts` (Preferences-backed, key `tweetalig-progress`): best-score-only per direction+lesson+game; `isLevelUnlocked` (level 1 always; level N when avg of played prior-level lesson-bests ≥40, per direction); `starFor` 🥉50/🥈70/⭐90; corrupt-store guard on read. Wired into App (load/save), LessonSelect (real locks), Home (progress summary), Results (star badge).
  - Battery: build, lint (clean), format:check, 38 unit (24 prior + 14 new), 20 e2e (18 prior + 2 M7) — all PASS. `verification-shots/M7/`.
  - Independent gate: **PASS**, no blocking findings; one low design note (M7-note-1, unlock leniency). Verifier re-ran the battery and confirmed the M2 fresh-install-locked invariant still holds. Report `verification-shots/M7/verifier-gate-report.md`.

## Run summary (M0–M7) — Run A feature build COMPLETE
- M0–M2 merged and live on `main`. **M3–M7 all built + independently verified (PASS)**, committed on `milestone/M3-flashcards`, awaiting human push + merge. The four games + the progress/scoring/unlock loop are done.
- Acceptance ledger: M0–M7 entries all `passes: true` with cited evidence. (M8/M9 = Run B delight layer; M10 = packaging — both untouched.)
- Cumulative debt: 3 low (M3) + 1 low (M4) + 1 low design note (M7) = 5 open, all low, none medium+. At the 5-open advisory line but zero medium+ — no STOP required; worth a glance at triage before Run B.
- **Only remaining in Run A:** M10 packaging — deploy web to a free static host + build/sign an APK in Android Studio and confirm a full lesson in airplane mode. **Human-driven** (`needs-human-check`): Edward makes the hosting account and runs the Android build; Claude can do the Playwright load of the live URL and record results. See `tweetalig-v2/RESUME_Claude_executor.md`.
