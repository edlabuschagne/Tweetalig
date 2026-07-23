# Builder Self-Check — Milestone 1: Core data + offline audio playback

Verdict: PASS

Check 1 Acceptance: PASS. M1-1 is proved by the tricky-word table in `tests/unit/player.test.ts:43` and `test.txt`. M1-2 is proved by the 164-file assertion in `tests/unit/audio-assets.test.ts:10` and `test.txt`. M1-3 is proved by `tests/e2e/audio.spec.ts:21`, `M1-3-audio-requests.json`, `M1-3-correct-audio-path.png`, and `e2e.txt`. M1-4 is proved by the single-active-audio assertions in `tests/unit/player.test.ts:55` and `test.txt`. M1-5 is proved by `tests/e2e/audio.spec.ts:62`, `M1-5-offline-network.json`, `M1-5-offline-audio.png`, and `e2e.txt`.

Check 2 Injection/unsafe: PASS. Audio paths are built only by `audioPath()` through `slugify()` in `src/audio/player.ts:5-17`; no eval, unsafe HTML, or unchecked dynamic file construction was introduced.

Check 3 Scope: PASS. The diff contains only the M1 player, development-only test surface, tests, Vite test-server cache behavior, evidence, acceptance flips, and handoff. No live TTS, games, progress storage, backend, auth, analytics, ads, or new dependency was added.

Check 4 Regression: PASS. The M0 browser test remains green. `npm run verify` passes, and the reused `src/data/lessons.ts` and `public/audio/**` have no diff.

Check 5 Never-lean floor: PASS. Buttons have accessible names, visible focus, and at least 44px height in `src/App.tsx:72-87`. The audio suite proves bundled offline playback and zero external requests. No personal data or runtime external network call was introduced.

Check 6 Tripwires: PASS. `guard.txt` records branch `milestone/M1-audio`, `.githooks`, and a passing local Forge guard in the restricted workspace. No secrets, environment/security configuration, paid resources, deployment, history rewrite, force-push, or remote deletion occurred.

Check 7 Debt ledger: none. No debt marker or hidden shortcut was found in the milestone diff.

Check 8 Observable outcomes: PASS. Visual inspection of `M1-3-correct-audio-path.png` shows Afrikaans “Blou” actively playing with no error. `M1-5-offline-audio.png` shows English “Red” playing after the context was taken offline; `M1-5-offline-network.json` records no offline request and no external request because the bundled preloaded file resolved from cache.

Notes (non-blocking): none.

Blocking findings: none.
