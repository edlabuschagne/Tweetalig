# Builder self-check — Milestone 7: Progress, scoring, level unlock

Executor: Claude (Cowork). Rig: `/home/claude/tw` (cloud). Branch: `milestone/M3-flashcards`.

## Check 1 — Acceptance criteria
- **M7-1 unit tests (best-only, unlock≥40, stars):** `src/storage/progress.ts` + `tests/unit/progress.test.ts` — `mergeBest` keeps higher/ignores lower (+clamp/round, no entry for non-positive); `isLevelUnlocked` level 1 always, 39 locked / 40 unlocked, direction-specific; `starFor` 49→null/50→🥉/69→🥉/70→🥈/89→🥈/90→⭐. **PASS**
- **M7-2 ≥40 on Level 1 unlocks Level 2 after reload:** e2e `progress.spec.ts` plays Colors Flashcards (100) → `page.reload()` → Continue → `"Body Parts to Liggaamsdele"` `toBeEnabled()`. Shot `M7-2-level2-unlocked.png` (Level 2 Open, Level 3 still Locked). **PASS**
- **M7-3 Results shows correct star at threshold:** `src/screens/Results.tsx` renders `starFor(score)`. e2e drives Listen to 100/75/50 → Gold/Silver/Bronze. Shots `M7-3-gold.png`, `M7-3-silver.png`, `M7-3-bronze.png`. **PASS**
- **M7-4 progress survives restart:** Preferences-backed `progress.ts`; e2e reloads and asserts the Home summary (`home-progress`) shows "practised". Shot `M7-4-home-progress.png`. **PASS**
- **M7-5 no console errors:** both e2e tests assert `errors.toEqual([])`. **PASS**

## Check 2 — Injection / unsafe
No `dangerouslySetInnerHTML`/`eval`/dynamic paths. Progress values are numbers; the read path (`getProgress`) parses JSON in try/catch and keeps only finite numbers — a corrupt store degrades to `{}` rather than crashing. **PASS**

## Check 3 — Scope (DO-NOT-BUILD: XP/streaks/mascot/confetti — Run B; leaderboards; cloud sync)
None built. Only progress persistence, level-unlock, stars, and the three wiring points (App/LessonSelect/Home/Results). No animations/XP/streaks/leaderboard/network sync. **PASS**

## Check 4 — Regression
38 unit (25 prior + 13 new) + 20 e2e (18 prior + 2 M7) all green. Critically, M2-2's fresh-install "Levels 2 and 3 locked" assertion still passes because empty progress ⇒ `isLevelUnlocked` false for levels 2/3. LessonSelect/Home/Results/App changes are additive; no game logic touched. **PASS**

## Check 5 — Never-lean-able floor
- Data integrity: best-only writes never lower a score; corrupt/partial store is sanitised on read; writes are skipped when nothing changed. **PASS**
- Security: no secrets, no network/cloud sync, no PII (scores only, on-device). **PASS**
- Accessibility: star badge uses emoji (aria-hidden) PLUS a text label ("Gold star!"); LessonSelect locked cards keep `disabled` + "🔒 Locked" text; Home summary is plain text. Existing focus/tap-target patterns unchanged. **PASS**
- Offline: Preferences is local; fully offline. **PASS**

## Check 6 — Tripwires
No history rewrite, no out-of-scope deletion/overwrite, no secrets/config, no spend/publish. **PASS**

## Check 7 — Debt ledger
No `forge-debt:` markers. Design note (low): level-unlock is per-direction (progress is keyed by direction); a child switching direction sees that direction's unlock state — intentional, matches the keyed data model.

## Check 8 — Observable outcomes
Confirmed: `M7-2-level2-unlocked.png` (Level 2 Open post-reload, Level 3 Locked); `M7-3-silver.png` (75 → 🥈 Silver star) and gold/bronze counterparts; `M7-4-home-progress.png` (summary reflects saved state). No error/empty/unstyled states.

Self-verdict: ready for independent Verifier.
