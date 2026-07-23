# START HERE — driving Tweetalig v2 with Codex + Android Studio

Written for a non-developer. This is the "what do I actually click" guide. The theory lives in `AGENTS.md` and `docs/`; this is the operating manual.

The shape of the whole thing: **Codex builds the web app in the cloud → gives you Pull Requests → a fresh Codex task checks each one (the Verifier) → you merge → repeat. At the end, you deploy the web version for a shareable link, and build the APK in Android Studio to install on the phone.**

---

## One-time setup

### 1. Create the GitHub repo (you do this — it's a tripwire, human-owned)
1. On your **personal** GitHub account, create a new **empty private** repo, e.g. `tweetalig`.
2. Put these planning docs into it, at the root:
   - `AGENTS.md`, `README.md`, `HANDOFF.md`, `START_HERE_Codex_and_Android.md`
   - the whole `docs/` folder
3. Bring across the two **reused assets from v1** (this is the valuable part we're keeping):
   - `src/data/lessons.ts` — the curriculum
   - `public/audio/af/` and `public/audio/en/` — the 170 MP3 files
   *(Codex will scaffold the rest of the app around these in Milestone 0. You don't need to copy anything else from v1.)*
4. Commit and push. Tip: turn on **branch protection** for `main` (Settings → Branches) so nothing lands there without a PR. That's part of what makes the autonomous run safe.

### 2. Connect Codex to the repo (ChatGPT app)
In the ChatGPT app, open **Codex**, and connect it to your new `tweetalig` GitHub repo (grant it access to that repo only). Codex will read `AGENTS.md` automatically.

---

## The build rhythm (repeat per milestone)

For each milestone you run two Codex tasks: a **Builder** and a **Verifier**. Keeping them separate is the whole point — the Verifier must not see the Builder's reasoning.

### A) Builder task
Paste a prompt like this (change the milestone number and your run length):

> Follow `AGENTS.md` and `docs/` (Project Forge, Autonomous Mode). Build **Milestone 0** only, on a branch `milestone/M0-bootstrap`. Honour the milestone's acceptance criteria and DO-NOT-BUILD list. Run the full battery (build, lint, test, e2e), capture outcomes to `verification-shots/M0/`, flip only the ACCEPTANCE.json entries you can prove, refresh `HANDOFF.md`, and open a PR. **Run length for this session: stop after Milestone 2.** Stop at any tripwire, any Verifier FAIL, or any `needs-human-check` milestone, per the run loop.

Codex works in its container and opens a PR when done.

### B) Verifier task (fresh — start a NEW Codex conversation)
Open a **new** Codex task (so it has none of the Builder's context) and paste this **verbatim**, pointing it at the PR:

> You are the Forge Verifier. You did not write this code. Your job is to find the fudge, not to bless the work — but flag only what affects correctness, a stated acceptance criterion, or the Check 5 floor; everything else is a note at most, never grounds to withhold PASS. You may read ONLY: `docs/PROJECT_SCOPE.md`, the full `docs/ARCHITECTURE.md`, the current milestone's acceptance criteria + DO-NOT-BUILD from `docs/MILESTONES.md`, `docs/ACCEPTANCE.json`, `docs/VERIFICATION.md`, and the diff of this PR plus its battery output and `verification-shots/`. Run the eight checks in `docs/VERIFICATION.md` IN ORDER. Output the Gate Report in the exact format of VERIFICATION.md §2. Verdict: PASS / PASS-WITH-NOTES / FAIL, always with file:line references. Before writing the report, re-check every file:line citation against the actual diff — a wrong reference invalidates the finding. If you cannot cite it, it did not pass.

### C) Act on the verdict
- **PASS / PASS-WITH-NOTES** on an `auto-verifiable` milestone → merge the PR, tell the Builder to continue to the next milestone.
- **needs-human-check** milestone (M0, M3, M8, M10) → even on a PASS, *you* look first: pull the branch or open the deployed preview, click around, then merge if happy.
- **FAIL** → paste the Gate Report back to the Builder task: "Verifier returned FAIL, here's the report, fix and re-verify." Don't merge.

Then move to the next milestone. That's the loop.

> **Tip:** for your first outing, keep the run length short ("stop after M2"). Once you trust it, widen it ("run M4–M7, stop on any FAIL or needs-human-check").

---

## Shipping Run A

### Deploy the web build (your shareable link)
When M7 is merged, deploy the web app so parents can try it in a browser:
- Easiest: **Netlify** or **Vercel** — connect your GitHub repo, it auto-builds on every push. Build command `npm run build`, output dir `dist`. Free tier is plenty.
- You'll get a public URL like `tweetalig.netlify.app` to share. *(You own this step — creating the account is a human-owned action.)*
- M10's Verifier check loads this **live URL** to confirm it renders (not just localhost).

### Build the APK (install on the phone)
This is the part Codex can't do — it needs Android Studio on your machine.
1. Pull the latest `main` to your Windows machine (GitHub Desktop is fine if the terminal isn't your thing).
2. In the project folder: `npm install`, then `npm run build`, then `npx cap sync`.
3. `npx cap open android` — opens the project in Android Studio.
4. In Android Studio: **Build → Build App Bundle(s) / APK(s) → Build APK(s)**. For a quick install, a **debug** APK is fine.
5. Put the APK on the phone (USB, or upload somewhere and download on the phone), tap to install (you may need to allow "install from unknown sources" for beta). 
6. Confirm: turn on **airplane mode**, open the app, complete a lesson with audio. That's M10's acceptance — note it in `HANDOFF.md`.

*(A **release/signed** APK for wider sharing needs a keystore — that's a small extra step we can walk through when you get there. Don't commit the keystore; it's in `.gitignore`.)*

---

## Then: Run B (the delight layer)
Only after Run A is installed and working, start a fresh run for **M8–M9** (Kobi, XP, streaks, confetti, parent guide, beta badge). Same rhythm. M8 is `needs-human-check` on purpose — it's the fun, subjective part, and it's where v1 got stuck, so you eyeball it.

---

## If something feels off
- Codex stuck retrying the same fix → the STOP RULES say stop after 3 attempts. Tell it to stop and write the blocker to HANDOFF.md, then bring the blocker here and we'll sort it.
- A PR touches files it shouldn't (like the audio folder or lessons.ts) → that's a scope/tripwire flag; don't merge, send it back.
- Verifier keeps passing things that look wrong to you → tell me; per Forge we turn that miss into a rule so it doesn't recur.
