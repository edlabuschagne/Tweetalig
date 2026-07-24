# Gate Report — Milestone 3: Flashcards
Verdict: PASS-WITH-NOTES

> Independent Verifier: a fresh Claude agent given only the milestone diff, PROJECT_SCOPE, full ARCHITECTURE, the M3 acceptance criteria + DO-NOT-BUILD, ACCEPTANCE.json, VERIFICATION.md, the battery output, and the screenshots — never the builder's reasoning.

Check 1 Acceptance:
- **M3-1** (flip reveals translation + emoji, auto-plays audio) — **PASS.** `revealOrReplay` sets `isFlipped(true)` and calls `playWord(toWord, audioLanguage)`; back face renders `word.emoji` + `toWord` + "Tap to hear again". Live `waitForResponse` asserts `/audio/af/rooi.mp3` 200/206 (flashcards.spec.ts). Screenshot M3-1-card-back.png confirms 🔴 + "Rooi".
- **M3-2** (round completes → Results, numeric 0–100) — **PASS.** `advance()` → `onComplete(100)` on last card; App routes to Results; Results renders `{score}` "out of 100". Test asserts "Score 100 out of 100" + "Great learning!". M3-2-results.png confirms.
- **M3-3** (both directions) — **PASS.** Direction derives from/to word + audio lang. af-en test asserts Rooi→Red, "Replay English audio for Red", `/audio/en/red.mp3`. Distinct captures M3-3-af-en.png and en-af back state.
- **M3-4** (labelled, focus visible) — **PASS.** Context-aware `aria-label` + `focus-visible:outline-8`; test asserts `toHaveAccessibleName` + `toBeFocused` after Tab. M3-4-keyboard-focus.png shows a visible cyan focus ring.
- **M3-5** (no console errors) — **PASS.** All three tests attach console + pageerror listeners and assert `errors.toEqual([])`.

Check 2 Injection/unsafe: **PASS.** Audio paths flow only through `audio/player.ts` slugify; no `dangerouslySetInnerHTML`, `eval`, or string-built paths.

Check 3 Scope: **PASS.** Only Flashcards built; GamePlay renders Flashcards alone; other tiles stay "Coming next". No XP/streak/confetti, no extra sound FX. No package.json change; no backend/network/TTS.

Check 4 Regression: **PASS.** Battery green (build, lint, format:check, 16 unit, 9 e2e). Diff stays inside games/, screens/, components/, App.tsx, tests/. M2-4 still finds four game tiles.

Check 5 Never-lean floor: **PASS.** No new text input to validate. No secrets/network/PII. A11y: labels, visible focus, colour-plus-icon, tap targets ≥ min-h-11/12. Offline intact — bundled audio, no runtime fetch.

Check 6 Tripwires: **PASS.** guard.txt records restricted workspace, milestone branch, `hooksPath=.githooks`, main/force/delete blocked. No history rewrite, out-of-scope deletion, secret touch, spend, or publish.

Check 7 Debt ledger: No `forge-debt:` markers. Three unmarked minor shortcuts logged as notes (none touch the Check 5 floor).

Check 8 Observable outcomes: **PASS.** All five screenshots show correctly styled, reachable states with no error/empty/unstyled flashes.

Notes (non-blocking):
- `M3-1-audio-request.json` is written by the test (`writeFileSync`, hardcoded `externalRequests: []`), not a raw capture — the live `waitForResponse` is the genuine proof. Cosmetic.
- Score hardcoded to 100 on completion — reasonable for a no-scoring review game; real per-game scoring is M7's remit. Low severity.
- `captureM2` skip-if-exists means M2 screenshots won't refresh on future UI drift; assertions unaffected. Low severity.

Blocking findings: none.

Note: M3 is a `needs-human-check` milestone — per VERIFICATION.md §0 the run stops for the human even on PASS. The human visually approved the flashcard feel from the screenshots before this gate.
