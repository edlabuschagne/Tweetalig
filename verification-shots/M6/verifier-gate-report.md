# Gate Report — Milestone 6: Spell It
Verdict: PASS

_Independent Verifier (fresh context, vision-capable, re-ran the battery). Executor: Claude (Cowork)._

Battery (independently re-run in /home/claude/tw): build PASS · lint PASS · format:check PASS · unit 24/24 · e2e 18/18.

Check 1 Acceptance: PASS
- M6-1 (accent-insensitive correct scores positive): PASS. `src/games/spell-check.ts` folds diacritics; unit `tests/unit/spell-check.test.ts` asserts `isSpellingCorrect("voel","Voël")===true`, `"more"/"môre"`, `"reen"/"Reën"`; e2e `tests/e2e/spell-it.spec.ts` (M6-1) types accent-dropped "Voel" for Bird→"Correct". Shot `M6-1-accent-correct.png`.
- M6-2 (incorrect reveals correct spelling): PASS. `src/games/SpellIt.tsx` renders `✗ Not quite — it’s spelled "{answer}"`; e2e (M6-2) "xyz" for Red → feedback contains "Rooi"+"Not quite". Shot `M6-2-wrong.png`.
- M6-3 (Results with score, both directions, no console errors): PASS. e2e (M6-3) completes en-af and af-en to "Score 100 out of 100" with `errors.toEqual([])`. Shots `M6-3-results.png` (Colors→Kleure), `M6-3-af-en.png` (Kleure→Colors).
- ACCEPTANCE.json M6 flip contract-clean: only `passes` false→true and `evidence` empty→cited; texts/order/count unchanged; M7–M10/M8/M9 remain false. Not tampering.

Check 2 Injection/unsafe: PASS. No `dangerouslySetInnerHTML`/`eval`. User-typed guess rendered only as an escaped React text node; the reveal interpolates curated `answer` from `lessons.ts`. Audio via `audio/player.ts`.

Check 3 Scope: PASS. Diff adds only Spell It + two additive wiring points (`GamePlay` `case "spell"`, `GameSelect` builtGames += `"spell"`). No mascot/confetti/XP/streak, no other game.

Check 4 Regression: PASS. 24 unit (16 prior + 8 new) and 18 e2e (M0–M5 + 3 M6) all green in the Verifier's own run. No prior source file modified except the two switch/array entries.

Check 5 Never-lean floor: PASS. Input validation: `maxLength={40}`, empty/whitespace submit ignored, Check disabled while empty, checker rejects empty/punctuation-only (unit-tested); friendly reveal on wrong. Accessibility: labelled input (`htmlFor`/`id`), `aria-describedby`→`aria-live` feedback, per-question auto-focus, min-h-14/12 targets, focus-visible, colour-PLUS-icon (✓/✗). Security: no secrets, no new network origin, no PII. Offline: bundled audio, no persistence writes.

Check 6 Tripwires: PASS. No history rewrite, no out-of-scope deletion/overwrite, no secrets/config, no spend/publish. (Windows autonomous-mode `.ps1` guard-proof is not in the Linux cloud evidence — non-blocking; behavioural tripwire audit is clean.)

Check 7 Debt ledger: none. No `forge-debt:` markers; no unmarked shortcut touching the Check 5 floor.

Check 8 Observable outcomes: all four shots show the real state (accent-dropped "Voel" accepted; "xyz" reveals "Rooi"; 100/100 Results both directions). No error/empty/unstyled states.

Notes (non-blocking): builder self-check records the shared branch name `milestone/M3-flashcards` (all M3–M7 commits land there by plan); the Windows Forge-guard `.ps1` proof is not present in the cloud rig. Neither affects a criterion or the Check-5 floor.

Blocking findings: none.
