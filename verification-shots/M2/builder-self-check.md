# Builder Self-Check — Milestone 2: Home and navigation shell

Verdict: PASS

Check 1 Acceptance: PASS. M2-1 is proved by the reload path at `tests/e2e/navigation.spec.ts:28` plus `M2-1-home-empty.png`, `M2-1-home-named.png`, and `verify.txt`. M2-2 is proved by the 10-card and six-lock assertions at `tests/e2e/navigation.spec.ts:60` plus `M2-2-lesson-locks.png`. M2-3 is proved by both direction assertions and `M2-3-direction-en-af.png` / `M2-3-direction-af-en.png`. M2-4 is proved by the four-tile assertions at `tests/e2e/navigation.spec.ts:99` and `M2-4-game-select.png`. M2-5 is proved by the console/page-error collectors in all M2 browser paths and `verify.txt`.

Check 2 Injection/unsafe: PASS. The first name is trimmed, length-limited, and restricted to Unicode letters plus safe first-name separators at `src/storage/player-name.ts:6`. No unsafe HTML, eval, or unchecked dynamic file path was introduced.

Check 3 Scope: PASS. The diff contains only M2 Home/LessonSelect/GameSelect shell behavior, the approved Preferences dependency and native sync, the M1 dev-test route adjustment, tests, evidence, acceptance flips, and handoff. Game tiles are explicitly non-functional. No game logic, scoring, delight layer, or parent guide was built.

Check 4 Regression: PASS. `npm run verify` passes 16 unit tests and 6 browser tests, including unchanged M0 and M1 behavior. `src/data/lessons.ts` and `public/audio/**` have no diff.

Check 5 Never-lean floor: PASS. Name validation has friendly errors and a 24-character input cap. Interactive controls have semantic labels, visible focus, and at least 44px height. Preferences stores only the first name on-device. No runtime external request or PII transmission exists.

Check 6 Tripwires: PASS. `@capacitor/preferences@8.0.1` was explicitly human-approved before installation and is recorded in `HANDOFF.md`. `guard.txt` records the M2 branch, hooks path, and passing guard. No direct main write, force-push, deployment, secret, billing, remote deletion, or unapproved dependency occurred.

Check 7 Debt ledger: none.

Check 8 Observable outcomes: PASS. Visual inspection confirms a clean empty Home, persisted “Welcome back, Mia!” Home, all 10 lessons with Levels 2–3 visibly locked, both reversed language-label states, and exactly four “Coming next” game tiles with no game implementation.

Notes (non-blocking): none.

Blocking findings: none.
