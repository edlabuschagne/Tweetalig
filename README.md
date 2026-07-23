# Tweetalig

An offline, kid-friendly Android app for learning everyday **Afrikaans ↔ English** through short, playful games with real spoken pronunciation. No accounts, no ads, no ongoing costs — all audio is bundled, so it works fully offline.

Built for young learners at bilingual South African primary schools (and their parents).

## Status: beta / in active build

Built with the [Project Forge](https://github.com/edlabuschagne/project-forge) methodology in Autonomous Mode, executed by Codex.

- **How to build & run:** see [`START_HERE_Codex_and_Android.md`](START_HERE_Codex_and_Android.md)
- **What it is & why:** [`docs/PROJECT_SCOPE.md`](docs/PROJECT_SCOPE.md)
- **How it's built:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **The build plan:** [`docs/MILESTONES.md`](docs/MILESTONES.md)
- **Agent harness:** [`AGENTS.md`](AGENTS.md)

## Stack

React + Vite + TypeScript + Tailwind, wrapped with Capacitor into an Android APK. Deployable as a static web link for sharing. Tests: Vitest + Playwright.

## Privacy

Nothing leaves the device. The only stored personal item is a child's first name, kept locally. No backend, no analytics, no data collection.
