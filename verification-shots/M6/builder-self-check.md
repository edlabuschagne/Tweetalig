# Builder self-check — Milestone 6: Spell It

Executor: Claude (Cowork). Rig: `/home/claude/tw` (cloud). Branch: `milestone/M3-flashcards`.

## Check 1 — Acceptance criteria
- **M6-1 accent-insensitive correct scores positive (unit + screenshot):** `src/games/spell-check.ts` `normalizeSpelling` folds diacritics; `isSpellingCorrect` compares normalised forms. Unit `tests/unit/spell-check.test.ts` asserts `'voel'`≈`'Voël'`, `'more'`≈`'môre'`, `'reen'`≈`'Reën'`. e2e `M6-1` types `Voel` for Bird and gets "Correct" (`M6-1-accent-correct.png`). **PASS**
- **M6-2 incorrect reveals correct spelling:** `src/games/SpellIt.tsx` shows `✗ Not quite — it’s spelled "{answer}"`. e2e `M6-2` types `xyz` for Red → feedback contains "Rooi" + "Not quite" (`M6-2-wrong.png`). **PASS**
- **M6-3 completes to Results, both directions, no console errors:** score = round(correct/total×100). e2e `M6-3` spells all 8 correctly en-af and af-en → "Score 100 out of 100"; `errors.toEqual([])`. Shots `M6-3-results.png`, `M6-3-af-en.png`. **PASS**

## Check 2 — Injection / unsafe
No `dangerouslySetInnerHTML`/`eval`/dynamic paths. User input is rendered only through React text nodes (auto-escaped); the answer reveal uses the curated lesson data, not user input. **PASS**

## Check 3 — Scope (DO-NOT-BUILD: XP/streaks/mascot/confetti — that's Run B/M8; other games)
No delight layer, no other game. New: `SpellIt.tsx`, `spell-check.ts`, unit + e2e specs; `GamePlay` `case "spell"`; `GameSelect` builtGames += `"spell"`. **PASS**

## Check 4 — Regression
All prior tests green alongside M6: 24 unit (16 prior + 8 new), 18 e2e (15 prior + 3 M6). No prior file modified except the two additive wiring points. **PASS**

## Check 5 — Never-lean-able floor
- **Input validation:** `maxLength={40}` caps the field; empty/whitespace submit is ignored and the Check button is disabled while empty; the forgiving checker rejects punctuation-only/empty guesses. Friendly reveal on wrong answers. **PASS**
- Security: no secrets, no new network beyond the existing bundled-audio `playWord`, no PII. **PASS**
- Accessibility: labelled input (`htmlFor`/`id`), `aria-describedby` → live feedback region, auto-focus per question, min-h-14/min-h-12 targets, focus-visible outlines, colour-PLUS-icon (✓/✗). **PASS**
- Offline: audio is bundled; no persistence writes in M6. **PASS**

## Check 6 — Tripwires
No history rewrite, no out-of-scope deletion/overwrite, no secrets/config, no spend/publish. **PASS**

## Check 7 — Debt ledger
No `forge-debt:` markers. Note (low): Spell It reuses the bundled-audio hear button (optional per the milestone sketch) — adds no new dependency or network origin.

## Check 8 — Observable outcomes
Each shot confirmed: Bird "Voel" → ✓ Correct; Red "xyz" → ✗ reveals "Rooi"; 100/100 Results both directions (Colors→Kleure and Kleure→Colors). No error/empty/unstyled states. **PASS**

Self-verdict: ready for independent Verifier.
