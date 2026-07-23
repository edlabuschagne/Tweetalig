# Milestones — Tweetalig v2

> Milestone 0 is bootstrap. Feature milestones start at 1. Each milestone carries **testable, observable** acceptance criteria, an explicit **DO-NOT-BUILD** list, an **autonomy tag** (`auto-verifiable` or `needs-human-check`, per FORGE_AUTONOMOUS_MODE.md §2a), and how it's **verified** on this stack.
>
> **The build is split into two runs** (decided in planning):
> - **Run A — the Learning App:** M0–M7 + M10 packaging. Ship a working, installable, offline bilingual learning app first.
> - **Run B — the Delight Layer:** M8–M9. Mascot, XP, streaks, confetti, parent guide, beta polish — built *after* Run A works, as its own run.
>
> **Run length is a dial YOU set per session.** Suggested first outing: "run through M2, then stop" so you can watch the Codex loop + Verifier behave before letting it go further.

---

## Autonomy tag legend

- `auto-verifiable` — acceptance provable by machine (test + captured screenshot/output). Verifier PASS → auto-proceed to next milestone (in Codex Cloud: open PR, run the Verifier task, merge, continue).
- `needs-human-check` — run **stops for your eyes even on a PASS**. Used for subjective "does it feel right" quality and for the Android device build you run yourself.

---

# RUN A — THE LEARNING APP

## Milestone 0 — Bootstrap
**Goal:** a runnable, version-controlled skeleton with the toolchain and harness proven — "hello world that actually runs," on web and as an APK shell.
**Autonomy:** `needs-human-check` (you create the repo/remote and do the first Android Studio open; Codex does the rest).
**Deliverables:** new GitHub repo (personal account) + `.gitignore` (node_modules, dist, /android build outputs, .env, *.keystore); Vite + React + TS + Tailwind skeleton that builds and starts; Capacitor installed, Android platform added; ESLint + Prettier + Vitest + Playwright configured; the reused `src/data/lessons.ts` and `public/audio/{af,en}/` bundled in; `AGENTS.md` + `docs/` in place; a `verify` npm script; HANDOFF.md seeded; baseline commit tagged.
**Acceptance Criteria (testable, observable):**
- [ ] `npm run build` completes with no errors (captured stdout).
- [ ] `npm run lint`, `npm run test`, and `npx playwright test` all run and pass on the empty skeleton (captured output).
- [ ] The dev server serves a placeholder home page; Playwright captures a screenshot showing the app title "Tweetalig" and no JS console errors.
- [ ] A unit test asserts every word in `lessons.ts` maps (via slugify) to an MP3 file that exists in `public/audio/` — and it passes (proves the reused assets are wired).
- [ ] `npx cap sync` succeeds and `android/` exists (captured stdout). *(APK actually opening in Android Studio is checked by YOU — see M10.)*
**DO-NOT-BUILD:** any game, any screen beyond a placeholder home, any styling beyond a title, any new dependency beyond the stack in ARCHITECTURE.md.
**Verification:** deterministic battery (build/lint/test/e2e) + Playwright screenshot of the placeholder home.

## Milestone 1 — Core data + offline audio playback
**Goal:** the audio engine works, offline, both languages.
**Autonomy:** `auto-verifiable`
**Deliverables:** `src/audio/player.ts` (slugify + play/stop, single source of truth); a dev-only test screen that lists a lesson's words with a play button each.
**Acceptance Criteria:**
- [ ] Unit test: `slugify()` returns the exact v1 slugs for a fixed table of tricky words (e.g. "Goeie môre" → `goeie-more`, "Where is the" → `where-is-the`).
- [ ] Unit test: every word in every lesson resolves to an existing MP3 in both `af/` and `en/` (extends M0's coverage test).
- [ ] Playwright: on the test screen, clicking a word's play button triggers a request to the correct `/audio/{af|en}/{slug}.mp3` path (asserted via network capture) and no console error.
- [ ] Playing a second word while the first plays stops the first (asserted: only one Audio element playing).
- [ ] **Offline:** with the browser context set offline AFTER load, audio files (bundled) still resolve — screenshot + network capture confirm no external fetch is required.
**DO-NOT-BUILD:** live TTS / Web Speech fallback (removed by design); any game logic; any progress storage.
**Verification:** Vitest + Playwright network+screenshot capture to `verification-shots/M1/`.

## Milestone 2 — Home, name entry, lesson & level select, direction toggle
**Goal:** the navigation shell a child moves through.
**Autonomy:** `auto-verifiable`
**Deliverables:** Home (first-name entry + progress summary), LessonSelect (10 lessons grouped by 3 levels with lock/unlock, level lock reflects progress), a direction toggle (EN→AF / AF→EN), GameSelect (four game tiles).
**Acceptance Criteria:**
- [ ] Entering a name on Home and reopening the app shows the saved name (persistence via Preferences; Playwright reload test).
- [ ] LessonSelect shows exactly the 10 lessons; Level 2 and 3 appear **locked** on a fresh install (screenshot shows lock state).
- [ ] Toggling direction updates the visible language labels (screenshot both states).
- [ ] Tapping a lesson → GameSelect shows the four games (screenshot).
- [ ] No console errors on any screen (JS error listener attached).
**DO-NOT-BUILD:** the games themselves; scoring; the mascot/XP/streak; parent guide.
**Verification:** Playwright screenshots of Home (empty + named), LessonSelect (both directions, lock states), GameSelect → `verification-shots/M2/`.

## Milestone 3 — Game: Flashcards  *(the first game pattern)*
**Goal:** flip-card learning with audio; establishes the shared game shell the next three copy.
**Autonomy:** `needs-human-check` — first-of-its-kind pattern; you eyeball the feel once before three more copy it.
**Deliverables:** Flashcards game (show word one side, translation + emoji + audio on flip), a shared game container (progress within a round, exit, next), score reported to Results.
**Acceptance Criteria:**
- [ ] Playing a lesson in Flashcards shows each word once; flipping reveals the translation and auto-plays its audio (screenshot of front and back; network capture of the audio request).
- [ ] Completing the round routes to Results with a numeric score 0–100 (screenshot).
- [ ] Works in both directions (screenshot each).
- [ ] Keyboard/tap accessible: cards have labels, focus is visible (a11y assertions).
- [ ] No console errors.
**DO-NOT-BUILD:** the other three games; XP/streak/confetti; sound effects beyond word audio.
**Verification:** Playwright screenshots + network capture → `verification-shots/M3/`. **Then STOP for your review.**

## Milestone 4 — Game: Listen & Choose
**Autonomy:** `auto-verifiable` (copies the M3 pattern)
**Deliverables:** hear a word, pick the matching option from 3–4 choices; correct/incorrect feedback; score.
**Acceptance Criteria:**
- [ ] A word plays on start / on a replay button; choices render (screenshot).
- [ ] Selecting the correct choice advances with positive feedback; wrong choice shows corrective feedback (screenshot both).
- [ ] Round completes → Results with score (screenshot).
- [ ] Both directions; no console errors.
**DO-NOT-BUILD:** anything from the delight layer; other games.
**Verification:** Playwright → `verification-shots/M4/`.

## Milestone 5 — Game: Match Pairs
**Autonomy:** `auto-verifiable`
**Deliverables:** match EN words to AF translations (tap-to-pair grid); score by accuracy/time.
**Acceptance Criteria:**
- [ ] Grid renders pairs; matching a correct pair locks it as matched (screenshot before/after).
- [ ] Mismatched pair resets (screenshot).
- [ ] All pairs matched → Results with score.
- [ ] Both directions; no console errors.
**DO-NOT-BUILD:** delight layer; other games.
**Verification:** Playwright → `verification-shots/M5/`.

## Milestone 6 — Game: Spell It
**Autonomy:** `auto-verifiable`
**Deliverables:** show a word (+audio), type the translation; forgiving check (case/whitespace/accents folded); score.
**Acceptance Criteria:**
- [ ] Correct answer (including accent-insensitive, e.g. "more" accepted for "môre") scores positive (unit test on the checker + screenshot).
- [ ] Incorrect shows the correct spelling (screenshot).
- [ ] Round completes → Results with score.
- [ ] Both directions; no console errors.
**DO-NOT-BUILD:** delight layer; other games.
**Verification:** Vitest (answer checker) + Playwright → `verification-shots/M6/`.

## Milestone 7 — Progress, scoring, level unlock, Results
**Goal:** the loop that makes progress persist and levels open up.
**Autonomy:** `auto-verifiable`
**Deliverables:** ported `storage/progress.ts` (Preferences-backed): save best score per direction+lesson+game; level unlock rule; stars; Results screen showing score + star badge; Home progress summary reflects saved state.
**Acceptance Criteria:**
- [ ] Unit tests: best-score-only-increases; level-unlock at ≥40 average; star thresholds (🥉50/🥈70/⭐90).
- [ ] Playthrough scoring ≥40 average on Level 1 **unlocks Level 2** after reload (Playwright: play → reload → Level 2 now unlocked; screenshot).
- [ ] Results screen shows the correct star for a given score (screenshot at ⭐/🥈/🥉 thresholds).
- [ ] Progress survives app restart (reload test).
- [ ] No console errors.
**DO-NOT-BUILD:** XP/streaks/mascot/confetti (that's Run B); leaderboards; cloud sync.
**Verification:** Vitest + Playwright reload tests + screenshots → `verification-shots/M7/`.

## Milestone 10 — Ship Run A: deploy web + build the APK
> Numbered 10 to keep the delight layer as 8–9; it runs at the END of Run A.
**Goal:** the app is live as a link AND installable on a phone.
**Autonomy:** `needs-human-check` — you perform the deploy account step and the Android Studio build/sign/install on your machine.
**Deliverables:** production web build deployed to a free static host (public URL); a signed **debug or release APK** built in Android Studio and installed on the target phone; README/HANDOFF updated with both.
**Acceptance Criteria:**
- [ ] **Deployed-surface check:** a real browser load of the **deployed URL** (not localhost) renders the Home screen with a JS-error listener attached and zero page errors (captured, origin asserted).
- [ ] The APK installs on a physical Android phone and a full lesson can be completed **in airplane mode** with audio (you confirm; note it in HANDOFF).
- [ ] No secrets in the repo; hosting config holds any env (there are none required).
**DO-NOT-BUILD:** Play Store submission (PARKED); paid hosting; custom domain (optional later).
**Verification:** Playwright load of the live URL + your manual device confirmation recorded in HANDOFF.md.

---

# RUN B — THE DELIGHT LAYER  *(start only after Run A ships)*

## Milestone 8 — Kobi the chameleon, XP, streaks, sound FX, confetti, encouragement
**Goal:** make it *fun* without breaking the working learning loop.
**Autonomy:** `needs-human-check` — subjective quality a screenshot can't fully settle; this is where v1 stalled, so human eyes gate it.
**Deliverables:** Kobi mascot presence (idle/celebrate states), XP accrual + level-up feedback, daily streak, correct/incorrect sound effects, confetti on results, rotating encouragement messages. All additive — **must not change existing game logic or the audio system.**
**Acceptance Criteria:**
- [ ] Existing M1–M7 tests still pass unchanged (regression gate — the delight layer added nothing that broke the learning app).
- [ ] Mascot renders on Home and Results (screenshot).
- [ ] Completing a round awards XP and shows a celebration; confetti appears on a high score (screenshot).
- [ ] Streak increments across sessions (test with simulated dates).
- [ ] Sound effects respect a mute toggle; audio for words still works (no clash).
- [ ] No console errors; a11y intact.
**DO-NOT-BUILD:** anything that alters scoring math or the audio engine; online leaderboards; account-based streaks.
**Verification:** full regression battery + Playwright screenshots → `verification-shots/M8/`. **STOP for your review.**

## Milestone 9 — Parent guide, beta badge, about/feedback
**Goal:** orient parents; signal beta; give a feedback path.
**Autonomy:** `auto-verifiable`
**Deliverables:** a Parent Guide screen (how to help, what the levels mean, that it's offline & private); a visible **BETA** badge; an About/feedback screen with a feedback link (a Google Form URL you supply — NOT a hardcoded personal email).
**Acceptance Criteria:**
- [ ] Parent Guide reachable from Home and renders the guide content (screenshot).
- [ ] BETA badge visible on Home (screenshot).
- [ ] Feedback link opens the configured URL (asserted; placeholder until you supply it, tracked as forge-debt).
- [ ] No console errors.
**DO-NOT-BUILD:** in-app messaging; collecting feedback into any backend; email harvesting.
**Verification:** Playwright screenshots → `verification-shots/M9/`.

---

## Global DO-NOT-BUILD (applies to every milestone)
- No backend, no auth, no account, no database.
- No runtime network call for core use; no analytics that phone home; no ads.
- No collection of personal data beyond a locally-stored first name.
- No new dependency without explicit approval (unsanctioned package = scope violation → FAIL).
- No live/cloud TTS at runtime.
- New ideas → `docs/PARKED.md`, unbuilt.
