# Builder self-check — Milestone 4: Listen & Choose

Executor: Claude (Cowork). Built on the M3 game pattern.

## Battery
- build, lint, format:check, 16 unit, 12 Playwright e2e — all PASS (fresh Linux rig). `verification-shots/M4/verify.txt`.
- The three M4 tests were hardened against a Home-screen loading race (wait for the name form OR "Continue learning" before branching); 3× repeat runs are stable.

## Scope built (only M4)
- `src/games/ListenChoose.tsx` — hear the target word (gesture-safe "Hear the word" button, auto-focused per question), pick from 4 choices (correct + 3 lesson distractors, shuffled); correct → positive feedback, wrong → corrective feedback revealing the answer; score = round(correct/total × 100) reported to Results.
- Reused/extended shared pieces: `GameShell` gained an optional `unitLabel` (default "Card"; M4 uses "Question") — additive, M3 unaffected. `GameSelect` now launches any game in `builtGames` (["flashcards","listen"]); `GamePlay` dispatches by `GameId`; `App` tracks `selectedGame`; `Results` completion line made game-neutral.
- Test: `tests/e2e/listen-choose.spec.ts` (M4-1..M4-3).

## DO-NOT-BUILD respected
- No Match Pairs / Spell It yet; no delight layer; no progress storage; no new dependency; no backend/network/TTS.

## Design notes
- Audio is never auto-played on mount (browser autoplay policy + keeps the console assertion clean); the child taps the auto-focused "Hear the word" button. Satisfies the "plays on … a replay button" clause of M4-1.
- Choices use `shuffle` (Math.random) memoised per question; tests select by known translation text, so shuffling needs no determinism hook.

## Acceptance ledger
- `docs/ACCEPTANCE.json` M4-1..M4-3 flipped to `passes: true` with cited evidence.
