# Gate Report — Milestone 4: Listen & Choose
Verdict: PASS

> Independent Verifier: a fresh Claude agent given only the M4 diff, PROJECT_SCOPE, ARCHITECTURE, the M4 acceptance criteria + DO-NOT-BUILD, ACCEPTANCE.json, VERIFICATION.md, the battery output, and the screenshots.

Check 1 Acceptance:
- M4-1 (word plays on start/replay; choices render) — PASS. Auto-focused "Hear the word" button calls `playWord(answer, audioLanguage)`; 4 choices render. Test asserts `toHaveCount(4)` + `waitForResponse /audio/af/rooi.mp3`. M4-1-question.png confirms. Tap-to-hear satisfies the disjunctive "on start / on a replay button" clause (acceptable given browser autoplay policy).
- M4-2 (correct → positive; wrong → corrective) — PASS. Feedback "✓ Correct! Well done." vs "✗ Not quite — the answer is '{answer}'."; test asserts both; M4-2-wrong.png (Swart ✗, Rooi ✓ + corrective) and M4-2-correct.png confirm.
- M4-3 (round → Results with score; both directions; no console errors) — PASS. Score = round(correct/total×100); test plays all 8 → "Score 100 out of 100", then reverse plays /audio/en/red.mp3 and asserts "Correct"; all three tests assert `errors.toEqual([])`. M4-3-results.png + M4-3-af-en.png confirm.

Check 2 Injection/unsafe: PASS. No dangerous HTML/eval/dynamic paths; audio only via `audio/player.ts` slugify.
Check 3 Scope: PASS. Only Flashcards + Listen built (`builtGames`); Match/Spell stay "Coming next"; no delight layer.
Check 4 Regression: PASS. Shared edits additive — `GameShell` `unitLabel?` defaults "Card"; `GamePlay` switch defaults to Flashcards; `Results` copy change cosmetic (M3 evidence cites the score label, not the line). No M0–M3 test touched; battery green (16 unit, 12 e2e). `package.json` and `lessons.ts` untouched.
Check 5 Never-lean floor: PASS. Visible focus, `aria-label`/`aria-live`, colour-plus-icon (✓/✗), min tap targets; bundled offline audio, no runtime network; no secrets/PII; audio failure caught without console error.
Check 6 Tripwires: PASS. No history rewrite, out-of-scope deletion, secret/config touch, or `package.json` change in the diff.
Check 7 Debt ledger: none marked. The single documented `eslint-disable react-hooks/exhaustive-deps` (keeps choices stable mid-question) is intentional, not hidden debt.
Check 8 Observable outcomes: PASS. All five captures show the criterion state via a real user path, fully styled, no error/empty/broken state.

Notes (non-blocking):
- `buildChoices` does not dedupe among distractors, relying on each lesson having ≥4 distinct translations (true for all current lessons). A future lesson with a duplicate translation could yield a React `key={choice}` collision. Data-shape note only; logged in the debt ledger.

Blocking findings: none.
