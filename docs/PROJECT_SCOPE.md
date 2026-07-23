# Project Scope — Tweetalig v2

> Forge Tier 2 (Standard). Executor: **Codex Cloud** (ChatGPT app). Planning done in chat; execution in the Codex harness against a GitHub repo. This doc is what the app *is and why* — the anchor the Verifier checks scope against.

## Vision

A warm, offline, kid-friendly Android app that helps young English-speaking children (and their parents) learn everyday Afrikaans — and vice versa — through short, playful games with real spoken pronunciation. It runs with **no ongoing AI or voice costs** because all audio is pre-generated and bundled into the app. Born from a real need: a 7-year-old at a bilingual school (Sunridge Primary, Gqeberha/PE) and parents looking for a respectful, fun way to bridge the two languages at home.

## Target Users

- **Primary:** children roughly aged 5–9 at bilingual (English/Afrikaans) South African primary schools — reading-light, tap-driven, needs to *hear* words.
- **Secondary:** their parents, who set it up, sit alongside, and want a short guide on how to help — many of whom are learning the second language themselves.
- **Device reality:** a shared or hand-me-down Android phone, often offline (in the car, no wifi). Offline-first is non-negotiable.

## Core Problem

Bilingual-school parents lack a fun, trustworthy, *offline* tool to practise the other language at home. Existing apps are either subscription-priced, aimed at adults, English↔big-language only (Afrikaans is poorly served), or need a constant internet connection and cloud TTS that costs money per play. Correct Afrikaans pronunciation — a low-resource language most TTS engines do badly — is the specific gap.

## Core Features (the must-haves)

1. **A curriculum of everyday words & phrases** across 10 themed lessons and 3 levels (colours, numbers, animals, family, body, food, greetings, school, phrases, weather) — reused from v1.
2. **Real pronunciation on tap**, both directions (EN→AF and AF→EN), played from **bundled offline audio files** — zero runtime cost.
3. **Four learning games:** Flashcards, Listen & Choose, Match Pairs, Spell It.
4. **Local progress & light gamification:** per-lesson best scores, level unlock, stars — all stored on-device, no account.
5. **A parent guide** and a clear **beta** signal.
6. **Installable on a phone (APK)** *and* shareable as a **web link** for other parents.

## Out of Scope (explicitly NOT building, for now)

- User accounts, login, or any server/backend.
- Any cloud call at runtime (no live TTS, no analytics that phone home, no ads).
- Collecting any personal data beyond a **first name stored locally on the device**.
- iOS build (architecture stays iOS-capable via Capacitor, but not built now → PARKED).
- In-app payments / subscriptions.
- Speech *recognition* (child speaking back) — PARKED as a future idea.
- The full "delight" layer (mascot, XP, streaks, confetti) — deferred to **Run B**, built only after the learning app ships.

## Success Criteria

- A parent can install the APK on a child's Android phone and the child can complete a full lesson in a game **with working Afrikaans + English audio, fully offline** (airplane mode).
- The web build is deployed to a public URL a parent can open on any phone browser.
- Progress persists across app restarts on-device.
- No personal data leaves the device; no runtime network call is required for core use.
- Built through the Forge autonomous loop with an independent Verifier PASS on every milestone.
