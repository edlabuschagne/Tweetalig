# Gate Report — Milestone 1: Core data + offline audio playback
Verdict: FAIL

Check 1 Acceptance: M1-1 PASS — tricky-word table and exact slugs at `tests/unit/player.test.ts:45-53`; independently rerun unit suite: 7/7 passed. M1-2 PASS — all 164 English/Afrikaans mappings checked at `tests/unit/audio-assets.test.ts:10-21`; unit suite passed. M1-3 PASS — exact response paths and successful statuses asserted at `tests/e2e/audio.spec.ts:21-42`, no console/page errors at `tests/e2e/audio.spec.ts:59`; `verification-shots/M1/M1-3-audio-requests.json` and `M1-3-correct-audio-path.png`; independently rerun Playwright suite passed. M1-4 PASS — first audio paused/reset and exactly one remains playing at `tests/unit/player.test.ts:55-68`; unit suite passed. M1-5 PASS — preload succeeds before `context.setOffline(true)`, offline replay succeeds, and external/error arrays are empty at `tests/e2e/audio.spec.ts:62-104`; `verification-shots/M1/M1-5-offline-network.json` and `M1-5-offline-audio.png`; independently rerun Playwright suite passed. `docs/ACCEPTANCE.json:15-19` changed only `passes` and `evidence`, and every citation exists.

Check 2 Injection/unsafe: PASS — audio text is normalized and restricted to safe slug characters at `src/audio/player.ts:5-16`; playback uses that single path constructor at `src/audio/player.ts:27-45`. No `eval`, unsafe HTML, or runtime network API was added.

Check 3 Scope: PASS — the UI is development-only at `src/App.tsx:96-97`; implementation contains only the audio player/test surface and verification support. No games, progress storage, live/Web Speech TTS, backend, auth, analytics, ads, or dependency change appears in `git diff main..HEAD`.

Check 4 Regression: FAIL — independent build, lint, 7 unit tests, and 3 Playwright tests passed, including the prior M0 browser test. However, the required command at `package.json:11`, `npm run format:check`, exits 1 in the actual checkout and reports 13 files, including `src/index.css:1`, `src/main.tsx:1`, and `package.json:1`. The committed `verification-shots/M1/format-check.txt` says it passed, but the independent deterministic battery is currently red. VERIFICATION.md requires any red battery to fail the gate.

Check 5 Never-lean floor: PASS — buttons have visible names, 44px minimum height, and focus-visible styling at `src/App.tsx:74-87`; status/error announcements are accessible at `src/App.tsx:59-65`. Offline behavior and zero external requests are exercised at `tests/e2e/audio.spec.ts:62-104`. No PII, analytics, secrets, persistence write, or external runtime feature was introduced.

Check 6 Tripwires: PASS — `verification-shots/M1/guard.txt:1` records the milestone branch, `.githooks`, and passing guard; `HANDOFF.md:35` records the restricted workspace and no production/secrets/billing access. Independent guard rerun passed. Branch is `milestone/M1-audio`; no forbidden hook/guard, secret/config, asset, curriculum, dependency, publishing, deletion, or history-rewrite change appears in the diff.

Check 7 Debt ledger: none — no `forge-debt:` marker or hidden Check-5 shortcut found in the milestone diff.

Check 8 Observable outcomes: `M1-3-correct-audio-path.png` visibly shows the Colours audio screen with “Playing Afrikaans: Blou” and no error; its JSON records `/audio/en/blue.mp3`, `/audio/af/blou.mp3`, and no external requests. `M1-5-offline-audio.png` visibly shows “Playing English: Red”; its JSON records the preloaded bundled path with empty offline and external request arrays. Both states were reproduced by the independent Playwright run.

Notes (non-blocking): The formatting failure is confined to 13 files unchanged by the M1 diff and is consistent with CRLF worktree materialization under `core.autocrlf=true`; this does not waive the deterministic-battery rule.

Blocking findings: `npm run format:check` currently exits 1, so the required battery is red.
