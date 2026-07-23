# Gate Report — Milestone 1: Core data + offline audio playback
Verdict: PASS

Check 1 Acceptance: M1-1 PASS — exact tricky-word slugs are asserted at `tests/unit/player.test.ts:45-53`; independent unit suite passed 7/7. M1-2 PASS — all 164 English/Afrikaans mappings are checked at `tests/unit/audio-assets.test.ts:10-21`; unit suite passed. M1-3 PASS — exact successful English/Afrikaans paths and zero browser errors are asserted at `tests/e2e/audio.spec.ts:21-59`, with `verification-shots/M1/M1-3-audio-requests.json` and `verification-shots/M1/M1-3-correct-audio-path.png`; independent E2E passed. M1-4 PASS — stopping/resetting the first audio and enforcing one active instance are asserted at `tests/unit/player.test.ts:55-68`; unit suite passed. M1-5 PASS — preload, offline replay, and zero external/browser errors are asserted at `tests/e2e/audio.spec.ts:62-104`, with `verification-shots/M1/M1-5-offline-network.json` and `verification-shots/M1/M1-5-offline-audio.png`; independent E2E passed. The repair leaves `docs/ACCEPTANCE.json:13-18` unchanged; `git diff origin/main..HEAD -- docs/ACCEPTANCE.json` is empty.

Check 2 Injection/unsafe: PASS — the repair changes no application code. Existing audio normalization and single-source path construction remain at `src/audio/player.ts:5-16`, with playback at `src/audio/player.ts:27-52`; no `eval`, unsafe HTML, unchecked dynamic path source, or runtime network feature was introduced.

Check 3 Scope: PASS — the actual repair diff changes only `.gitattributes`, `HANDOFF.md`, and `verification-shots/M1-repair/`. `.gitattributes:2` adds deterministic LF checkout behavior. No game logic, progress storage, live/Web Speech TTS, backend, auth, analytics, ads, dependency, curriculum, or audio asset changed.

Check 4 Regression: PASS — the original blocker is fixed. A fresh clone of exact HEAD `da060872e2800f4bf038cb4695e419991ad71a36` with `core.autocrlf=true` reported `text=auto eol=lf`, `i/lf w/lf`, zero CR bytes in representative formerly failing files, and no tracked `w/crlf` files. Independently rerun commands from `package.json:8-14` all exited 0: build, lint, format check, 7/7 unit tests, and 3/3 Playwright tests. `npm run format:check` reported all matched files compliant. The fresh run left no tracked diff; committed corroboration is at `verification-shots/M1-repair/verify.txt`.

Check 5 Never-lean floor: PASS — no runtime, PII, persistence, security, accessibility, or offline behavior changed. Existing accessible status/error output and labelled 44px controls remain at `src/App.tsx:59-65` and `src/App.tsx:74-87`; offline integrity remains covered at `tests/e2e/audio.spec.ts:62-104`. No dependency or runtime network call was introduced.

Check 6 Tripwires: PASS — human approval for the corrective line-ending repair is recorded at `HANDOFF.md:17`; the restricted-workspace/branch guard model is recorded at `HANDOFF.md:14`, and the corrective branch plus passing guard at `HANDOFF.md:43-44` and `verification-shots/M1-repair/guard.txt:1`. Independent guard rerun passed with branch `milestone/M1-format-repair` and `core.hooksPath=.githooks`. No unapproved history rewrite, hook/guard change, secret/auth change, publishing, billing action, remote deletion, or source-asset overwrite appears in the diff.

Check 7 Debt ledger: none — no `forge-debt:` markers or hidden Check-5 shortcut occur in the repair diff; `HANDOFF.md:20-21` records no cumulative debt.

Check 8 Observable outcomes: `verification-shots/M1/M1-3-correct-audio-path.png` visibly shows the Colours screen in the “Playing Afrikaans: Blou” state; its JSON records `/audio/en/blue.mp3`, `/audio/af/blou.mp3`, and no external requests. `verification-shots/M1/M1-5-offline-audio.png` visibly shows “Playing English: Red”; its JSON records the bundled preload with empty offline/external request arrays. The independent fresh-checkout E2E run reproduced these captures byte-identically, leaving no tracked diff.

Notes (non-blocking): none.

Blocking findings: none.
