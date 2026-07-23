# VERIFICATION.md — Tweetalig v2

> **One spec, two readers.** The **executor** (Codex, building the milestone) runs this as its own self-check before declaring done. The **independent Verifier** runs the *same* checklist again at the gate, in a **fresh context**, having never seen the executor's reasoning. In this project the Verifier is a **separate Codex Cloud task** pointed only at the milestone's PR diff + the inputs below.
>
> **Autonomous Mode:** the Verifier IS the gate. PASS / PASS-WITH-NOTES on an `auto-verifiable` milestone → merge the PR and proceed. `needs-human-check` or FAIL → STOP for you.

---

## 0. What the Verifier sees (and must NOT see)

Fresh context, ONLY:
- `docs/PROJECT_SCOPE.md`
- The **full** `docs/ARCHITECTURE.md` (assembled whole, never a slice)
- The current milestone's **acceptance criteria + DO-NOT-BUILD** from `docs/MILESTONES.md`
- `docs/ACCEPTANCE.json`
- This file
- The **actual diff** for the milestone (the PR diff / `git diff <milestone-start>..HEAD`), the battery output, and the captured outcomes in `verification-shots/M<X>/`

It must **not** inherit the executor's chat, plan, or "make this work" framing. For any milestone with a UI surface the Verifier must be **vision-capable** (it reads the screenshots).

**Stance:** adversarial about the *spec* — find the fudge, not bless the work. But flag only what affects correctness, a stated acceptance criterion, or the Check 5 floor. Style preferences and hypothetical hardening are notes at most, never grounds to withhold PASS.

**Verdict vocabulary — always with file:line references, never vibes:**
- **PASS** — every criterion met, no scope violation, no regression, battery green.
- **PASS-WITH-NOTES** — met, with logged debt/minor notes. Auto-proceeds unless a note is severity-high (then treat as FAIL).
- **FAIL** — a criterion unmet, a DO-NOT-BUILD item built, a regression, a tripwire crossed unapproved, or the battery red.

---

## 1. The eight checks (run in order)

**Check 1 — Acceptance criteria (correctness).** For each criterion in the milestone: cite it, cite the code/test/screenshot that satisfies it, state PASS/FAIL. No test/proof = not satisfied ("it should work" is a FAIL). The battery must have **actually run** — "tests pass" with no output is a FAIL. Work from `ACCEPTANCE.json`: every `passes:true` must be backed by its cited evidence; any change outside the `passes`/`evidence` fields is **tampering → FAIL**.

**Check 2 — No injection / unsafe construction.** N/A-heavy here (no SQL, no backend), but: no `dangerouslySetInnerHTML` with unsanitised input, no `eval`, no dynamic file paths built from unchecked strings. Audio paths come only through `audio/player.ts` slugify.

**Check 3 — Scope (DO-NOT-BUILD).** Did the executor build anything on the milestone's DO-NOT-BUILD list or the Global list? Building it is a **FAIL even if the code is good.** New ideas belong in `docs/PARKED.md`, unbuilt.

**Check 4 — Regression.** Did previously-green tests stay green? Did the diff touch files outside the milestone's expected surface? For M8 especially: the M1–M7 suite must pass **unchanged** — the delight layer is additive.

**Check 5 — The never-lean-able floor (FAIL if cut).**
- **Input validation** — name entry and Spell-It input guarded; friendly errors.
- **Security** — no secrets in code/commits; no runtime network call introduced for core use; no analytics phoning home; no PII leaving the device (only the local first name).
- **Accessibility** — tap targets, labels, visible focus, colour-plus-icon on new UI (kids' app).
- **Offline / data integrity** — core use works offline; progress writes don't corrupt on restart.

**Check 6 — Tripwire audit.** Confirm the change did not silently cross an `AGENTS.md` TRIPWIRE without recorded approval (git history rewrite; deleting/overwriting files outside the milestone's output; touching secrets/config; spending money; publishing). **Autonomous Mode:** also confirm the session-start guard note was recorded (for Codex Cloud: that work happened on a milestone branch in the isolated container, not force-pushed to main). Crossing one unapproved = **FAIL + STOP**.

**Check 7 — Debt ledger.** Grep the whole diff for `forge-debt:` markers; assemble them with `file:line` + severity (low cosmetic / med correctness-edge / high touches Check 5). Marked = decision log (record in HANDOFF). **Unmarked** shortcut = hidden debt → PASS-WITH-NOTES at best, FAIL if it touches the Check 5 floor.

**Check 8 — Observable-outcome verification (the eyes).** Tests prove asserted behaviour; this check **looks at the result.** For each criterion, open its capture in `verification-shots/M<X>/`: for a UI, the screenshot must show what the criterion says the user should see — not an error, empty state, broken layout, or unstyled flash — reachable by a real user's path. **Deployed surface (M10):** at least one capture is a real browser load of the **deployed URL** (never localhost), JS-error listener attached, origin asserted, zero page errors.

---

## 2. Gate Report format (the Verifier outputs exactly this)

```
# Gate Report — Milestone <X>: <name>
Verdict: PASS | PASS-WITH-NOTES | FAIL

Check 1 Acceptance: <per-criterion PASS/FAIL with file:line / shot path>
Check 2 Injection/unsafe: <PASS/FAIL + refs>
Check 3 Scope: <PASS/FAIL + refs>
Check 4 Regression: <PASS/FAIL + refs>
Check 5 Never-lean floor: <PASS/FAIL + refs>
Check 6 Tripwires: <PASS/FAIL + refs>
Check 7 Debt ledger: <entries or none>
Check 8 Observable outcomes: <per-shot confirmation>

Notes (non-blocking): <...>
Blocking findings: <... or none>
```

Before writing the report, re-check every file:line citation against the actual diff — a wrong reference invalidates the finding. If you cannot cite it, it did not pass.

---

## 3. The deterministic battery (§3) — exact commands for this stack

```
Build:   npm run build
Lint:    npm run lint
Format:  npm run format:check
Unit:    npm run test           # vitest run
E2E:     npm run e2e            # playwright test — also writes verification-shots/M<X>/
```

- **Outcome capture:** the Playwright run captures a screenshot (`.png`) per UI acceptance-criterion state to `verification-shots/M<X>/<criterion-id>.png`, and network captures where a criterion asserts an audio request or offline behaviour. Deterministic capture only — no agent hand-driving the app.
- **Deployed surface (M10 only):** the capture set includes a real page-load of the live URL with a JS-error listener, origin asserted in the capture. Local-only milestones skip this.
- **Security checks** are proven behaviourally the way a real user hits them — never via a privileged bypass path.

If a battery command is missing, STOP and report — do not invent one.

---

## 4. Debt ledger at handoff

At each milestone (and each run's end) collect all `forge-debt:` markers into a ledger appended to HANDOFF.md: marker text, `file:line`, severity (low/med/high). **Cumulative budget across the run:** before each new milestone the loop totals open entries; if it crosses **5 open** or **2 medium+** entries, **STOP for human triage even on a PASS** (the Verifier sees one diff and can't judge the pile).

---

## 5. Leanness floor check

Confirm the leanness order was honoured **and** never used to cut a Check 5 item: (1) YAGNI — no speculative generality; (2) stdlib/platform before a dependency — **no new dependency without explicit approval** (unsanctioned package = scope violation → FAIL); (3) native/platform feature before a hand-roll; (4) reuse what's installed; (5) one line if it can be one line. Leanness is a quality lens, never a licence to skip validation, security, accessibility, or offline integrity.
