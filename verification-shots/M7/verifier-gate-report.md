# Gate Report — Milestone 7: Progress, scoring, level unlock, Results
Verdict: PASS

_Independent Verifier (fresh context, vision-capable, re-ran the battery). Executor: Claude (Cowork)._

Battery (independently re-run in /home/claude/tw): build PASS · lint PASS · format:check PASS · unit 38/38 · e2e 20/20.

Check 1 Acceptance: PASS
- M7-1 (best-only, ≥40 unlock, stars): PASS. `src/storage/progress.ts` `mergeBest` keeps higher/ignores lower + round/clamp + no entry for non-positive; `tests/unit/progress.test.ts` pins best-only, unlock boundary **39 locked / 40 unlocked** + direction-specific, and star thresholds 49→null/50→🥉/69→🥉/70→🥈/89→🥈/90→⭐/100→⭐.
- M7-2 (≥40 unlocks Level 2 after reload): PASS. `tests/e2e/progress.spec.ts` plays Colors→100, `page.reload()`, Continue, "Body Parts to Liggaamsdele" `toBeEnabled()`. Shot `M7-2-level2-unlocked.png` (Level 2 Open post-reload, Level 3 Locked).
- M7-3 (correct star at each threshold): PASS. `src/screens/Results.tsx` renders `starFor(score)`; e2e drives 100/75/50 → Gold/Silver/Bronze. Shots `M7-3-gold.png`, `M7-3-silver.png`, `M7-3-bronze.png`.
- M7-4 (progress survives restart): PASS. Preferences-backed `getProgress`/`saveScore`; e2e reloads and asserts Home summary contains "practised". Shot `M7-4-home-progress.png`.
- M7-5 (no console errors): PASS. Both e2e tests assert `errors.toEqual([])`.
- ACCEPTANCE.json M7 flip contract-clean: only `passes` false→true and `evidence` empty→cited; texts/order/count unchanged. Not tampering.

Check 2 Injection/unsafe: PASS. No `dangerouslySetInnerHTML`/`eval`/dynamic paths. `getProgress` parses JSON in try/catch keeping only finite numbers.

Check 3 Scope: PASS. No XP/streak/mascot/confetti/leaderboard/cloud-sync. Diff confined to the M7 surface (progress.ts + 3 tests/specs + App/LessonSelect/Home/Results + ACCEPTANCE).

Check 4 Regression: PASS. M0–M6 suite green unchanged (20 e2e / 38 unit). Critically, M2-2's fresh-install "Levels 2 and 3 locked" assertion still passes (empty progress ⇒ levels 2/3 locked). No game logic altered; screen changes are additive prop-threading.

Check 5 Never-lean floor: PASS. Data integrity: `mergeBest` never regresses a score, skips redundant writes; corrupt/partial store degrades to `{}` without crashing. Security: no secrets, no network/cloud, on-device scores only. Accessibility: star uses aria-hidden emoji PLUS a text label; locked cards keep `disabled` + "🔒 Locked" + ", locked" accessible-name suffix. Offline: Preferences is local.

Check 6 Tripwires: PASS (no crossing in the diff). Note: the Windows Autonomous-Mode guard proof (`.ps1`/hooksPath) is not in the cloud evidence — process artifact, no correctness impact.

Check 7 Debt ledger: none new in code. Design note logged in HANDOFF (M7-note-1, low): per-direction unlock averaged over played lessons only — more lenient than a literal "average across all Level N-1 lessons"; satisfies every M7 criterion and preserves the M2 fresh-install-locked invariant.

Check 8 Observable outcomes: all five shots confirmed (Level 2 unlocked post-reload with Level 3 locked; 100→⭐ Gold, 75→🥈 Silver, 50→🥉 Bronze; Home "Levels 1–2 open · 1 lesson practised"). No error/empty/unstyled states.

Notes (non-blocking): (1) unlock leniency design note above; (2) verify.txt said "+13 new" unit tests — actual is 14 (total 38 correct); cosmetic, corrected.

Blocking findings: none.
