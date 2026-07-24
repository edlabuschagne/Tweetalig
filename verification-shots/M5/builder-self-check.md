# Builder self-check — Milestone 5: Match Pairs

Executor: Claude (Cowork). Rig: `/home/claude/tw` (cloud). Branch: `milestone/M3-flashcards`.
This is the executor's own pass over the eight checks before handing to the independent Verifier.

## Check 1 — Acceptance criteria
- **M5-1 Correct pair locks (before/after):** `src/games/MatchPairs.tsx` locks a pair into the `matched` Set; both tiles become `disabled` with an aria-hidden `✓`. e2e `M5-1` asserts `toBeDisabled()` + `toContainText("✓")`. Shots: `M5-1-before.png` (fresh grid), `M5-1-after.png` (Red↔Rooi green ✓, progress "Pair 1 of 6"). **PASS**
- **M5-2 Mismatch resets:** on a wrong pairing `wrongPicks` flags both tiles red `✗` with feedback "Not a match — try again"; neither locks; the next tap clears it and a correct pairing still works. e2e `M5-2` asserts feedback + both tiles `toBeEnabled()`, then a correct match `toBeDisabled()`. Shot: `M5-2-mismatch.png`. **PASS**
- **M5-3 All pairs → Results, both directions, no console errors:** completing all 6 pairs routes to `Results` with a 0–100 score. e2e `M5-3` asserts `Score 100 out of 100` for en-af and af-en (Kleure→Colors) and `errors.toEqual([])`. Shots: `M5-3-results.png`, `M5-3-af-en.png`. **PASS**

## Check 2 — Injection / unsafe construction
No `dangerouslySetInnerHTML`, no `eval`, no dynamic path building. Match Pairs uses no audio/network. **PASS**

## Check 3 — Scope (DO-NOT-BUILD: delight layer; other games)
No XP/streaks/mascot/confetti/celebration added; no other game touched. Only `MatchPairs.tsx` (new), `GamePlay.tsx` (+case), `GameSelect.tsx` (+"match" in builtGames). **PASS**

## Check 4 — Regression
All 12 prior e2e + 16 unit tests unchanged and green alongside the 3 new M5 tests (15 e2e total). Diff is confined to the M5 surface. **PASS**

## Check 5 — Never-lean-able floor
- Input validation: no free-text input in this game (tap-only). N/A, nothing weakened.
- Security: no secrets, no network call, no PII. **PASS**
- Accessibility: min-h-14 tap targets, `focus-visible` outlines, `aria-pressed` selection state, colour-PLUS-icon (✓/✗) feedback, aria-hidden glyphs so accessible names stay the plain word. **PASS**
- Offline / data integrity: fully offline, no persistence writes in M5. **PASS**

## Check 6 — Tripwires
No git-history rewrite, no deletion/overwrite outside the M5 output, no secrets/config touched, no spend/publish. `git add` will be explicit-path only. **PASS**

## Check 7 — Debt ledger
No `forge-debt:` markers introduced. None outstanding for M5.

## Check 8 — Observable outcomes
Each shot opened and confirmed to show the criterion's user-visible state (locked green pair; red mismatch; 100/100 Results in both directions) — not an error/empty/unstyled state. **PASS**

Self-verdict: ready for independent Verifier.
