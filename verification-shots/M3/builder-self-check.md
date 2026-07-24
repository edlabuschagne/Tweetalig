# Builder self-check — Milestone 3: Flashcards

Executor: Claude (Cowork), replacing Codex mid-run. Branch: `milestone/M3-flashcards`.

## Battery (VERIFICATION.md §3)
- `npm run build` — PASS (tsc --noEmit + vite build; 42 modules).
- `npm run lint` — PASS (eslint, no errors).
- `npm run format:check` — PASS (prettier, all files conform).
- `npm run test` — PASS (16 unit tests).
- `npm run e2e` — PASS (9 Playwright tests).
- Aggregate captured in `verification-shots/M3/verify.txt`.
- Re-run independently in a fresh Linux container (Claude's build rig): full battery PASS reproduced, confirming the green is not Windows-specific.

## Scope built (only M3)
- `src/games/Flashcards.tsx` — flip-card game: front shows the "from" word; flipping reveals the "to" translation + emoji and auto-plays the target-language audio via `audio/player.ts`; "Tap to hear again" replays; Next/Finish advances; completion reports score to Results.
- `src/components/GameShell.tsx` — shared game container (exit + round progress) the next three games will reuse.
- `src/screens/GamePlay.tsx` — hosts the active game (Flashcards only for now).
- `src/screens/Results.tsx` — score-only results screen (0–100), lesson label, Play again / Choose a lesson.
- `src/screens/GameSelect.tsx` — Flashcards tile now launches; the other three remain "Coming next".
- `src/App.tsx` — wires the game → results flow.
- Tests: `tests/e2e/flashcards.spec.ts` (M3-1..M3-5), `tests/e2e/navigation.spec.ts` (screenshot helper only; assertions unchanged).

## DO-NOT-BUILD respected
- No other three games; no XP/streak/mascot/confetti; no sound effects beyond word audio; no progress storage.
- Global: no backend/auth/db, no runtime network for core use, no new dependency (package.json unchanged; npm audit 0 vulnerabilities), no live TTS.

## Acceptance ledger
- `docs/ACCEPTANCE.json` M3-1..M3-5 flipped to `passes: true` with cited evidence.

## Notes / hidden debt (surfaced for the ledger)
- `M3-1-audio-request.json` is written by the test, not a raw network dump — the real `waitForResponse` assertion is the actual proof (cosmetic).
- Flashcards reports a fixed score of 100 (a review game with no wrong answers); real per-game scoring lands in M7.
- `captureM2` now skips a screenshot if the file already exists — M2 shots won't refresh on future UI drift (assertions unaffected).
