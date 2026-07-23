# KNOWLEDGE.md — memory map (load first)

The index of Tweetalig v2's durable knowledge. Load this, then traverse to the 1–3 nodes a task needs — do not bulk-read the corpus. `HANDOFF.md` (session state) is separate and read every session.

## Nodes

- **[AGENTS.md](../AGENTS.md)** — the harness: identity, autonomous run loop, STOP RULES, TRIPWIRES, Codex Cloud enforcement, security floor, QA. *Always loaded.*
- **[PROJECT_SCOPE.md](PROJECT_SCOPE.md)** — what the app is and why; users; core features; out-of-scope; success criteria.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — tech stack, component map, data models, the audio system, conventions. *The Verifier gets this whole, every gate.*
- **[MILESTONES.md](MILESTONES.md)** — the two-run build plan (Run A learning app, Run B delight), per-milestone criteria + DO-NOT-BUILD + autonomy tags + verification.
- **[ACCEPTANCE.json](ACCEPTANCE.json)** — the tamper-resistant, flip-only acceptance ledger.
- **[VERIFICATION.md](VERIFICATION.md)** — the eight-check gate spec + the exact battery commands + the Codex-Cloud verifier-as-separate-task pattern.
- **[PARKED.md](PARKED.md)** — captured-but-unbuilt ideas (voice upgrade, iOS, Play Store, speech practice).

## Edges (what links to what)

- MILESTONES criteria are mirrored in ACCEPTANCE.json (same IDs) — keep them in sync; editing a criterion means editing both, and only outside a run.
- ARCHITECTURE's audio system + data models are the contract M1–M7 build against.
- VERIFICATION Check 5 (never-lean floor) and AGENTS' security floor are the same rules, two readers.

## Maintenance rules

No orphan nodes (every doc is linked here). No stale edges (if you move/rename a doc, fix this map in the same change). If ARCHITECTURE.md ever grows past a cheap model's context, split it into linked sub-nodes here rather than trimming what the Verifier sees.
