# Gate Report — Milestone 2: Home, name entry, lesson & level select, direction toggle
Verdict: PASS

Check 1 Acceptance: M2-1 PASS — Preferences save/load at `src/storage/player-name.ts:20` and `src/storage/player-name.ts:25`, with reload proof at `tests/e2e/navigation.spec.ts:46`; shots `verification-shots/M2/M2-1-home-empty.png` and `verification-shots/M2/M2-1-home-named.png`. M2-2 PASS — exact 10-card and six-lock assertions at `tests/e2e/navigation.spec.ts:67`; shot `verification-shots/M2/M2-2-lesson-locks.png`. M2-3 PASS — direction and reversed-label assertions at `tests/e2e/navigation.spec.ts:69` and `tests/e2e/navigation.spec.ts:84`; shots `verification-shots/M2/M2-3-direction-en-af.png` and `verification-shots/M2/M2-3-direction-af-en.png`. M2-4 PASS — lesson navigation and four named tile assertions at `tests/e2e/navigation.spec.ts:105`; shot `verification-shots/M2/M2-4-game-select.png`. M2-5 PASS — console/page-error collection at `tests/e2e/navigation.spec.ts:7`, asserted empty at `tests/e2e/navigation.spec.ts:57`, `tests/e2e/navigation.spec.ts:96`, and `tests/e2e/navigation.spec.ts:124`. `docs/ACCEPTANCE.json:21`–`docs/ACCEPTANCE.json:25` changed only the permitted `passes` and `evidence` fields, with valid evidence.

Check 2 Injection/unsafe: PASS — names are trimmed, length-limited, and Unicode-letter validated at `src/storage/player-name.ts:6`; React renders the name as text at `src/screens/Home.tsx:63`. No `dangerouslySetInnerHTML`, `eval`, unchecked dynamic path, or runtime request construction was added.

Check 3 Scope: PASS — `src/screens/GameSelect.tsx:41` renders four non-interactive “Coming next” articles only. The diff contains no game logic, scoring, mascot, XP, streak, parent guide, backend, auth, analytics, or deployment work.

Check 4 Regression: PASS — a fresh disposable clone at HEAD `da08b9c025751ed06e90c234004bf980c56c56ae` with `core.autocrlf=true` passed build, lint, format check, 16 unit tests, and all 6 Playwright tests. Tracked text remained LF. M0/M1 tests passed, and `src/data/lessons.ts` plus `public/audio/**` are unchanged.

Check 5 Never-lean floor: PASS — friendly validation and errors are implemented at `src/screens/Home.tsx:24` and `src/screens/Home.tsx:102`; Preferences stores only the validated local first name at `src/storage/player-name.ts:20`. New controls have labels/pressed states, visible focus, large tap targets, and lock icon-plus-text at `src/screens/Home.tsx:83`, `src/screens/LessonSelect.tsx:38`, and `src/screens/LessonSelect.tsx:100`. No external runtime call or PII transmission was introduced.

Check 6 Tripwires: PASS — the guard independently passed on `milestone/M2-navigation` with `core.hooksPath=.githooks`; restricted-workspace and guard records are at `HANDOFF.md:14` and `HANDOFF.md:51`. The sole new dependency, `@capacitor/preferences@8.0.1` at `package.json:20`, has explicit approval recorded at `HANDOFF.md:18`. No sensitive configuration, hooks, guard script, history rewrite, deployment, billing, or remote state was touched.

Check 7 Debt ledger: none; the full milestone diff contains no `forge-debt:` marker or hidden Check 5 shortcut.

Check 8 Observable outcomes: PASS — all six PNGs were visually inspected. `M2-1-home-empty.png` shows the empty name form; `M2-1-home-named.png` shows persisted “Welcome back, Mia!”; `M2-2-lesson-locks.png` shows all 10 lessons with Levels 2–3 visibly locked; both M2-3 shots show the corresponding direction and reversed labels; `M2-4-game-select.png` shows exactly four intact “Coming next” tiles. No broken, empty, clipped, or error state is visible.

Notes (non-blocking): none.
Blocking findings: none.
