# Architecture — Tweetalig v2

> The full current architecture. At every gate the Verifier receives **this whole file** (assembled deterministically), never a slice. Keep it current; if it ever bloats past a cheap model's context, that's a signal to split into linked nodes (KNOWLEDGE.md), not to trim.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** | Type safety; Codex's strongest terrain |
| UI | **React 18 + Vite** | Fast, simple, huge ecosystem; reuses v1's mental model |
| Styling | **Tailwind CSS** + a few shadcn/ui primitives | Kid-friendly styling fast; reused from v1 |
| Routing | **React Router** | Simple client-side screens |
| Native shell | **Capacitor 6** | Wraps the web app into a real installable Android APK; keeps iOS open for later |
| Local storage | **Capacitor Preferences** (with a thin wrapper) | Robust on-device persistence in the WebView; replaces raw `localStorage` |
| Audio | Bundled **MP3 files** played via HTML5 `Audio` | Offline, zero runtime cost — the core design decision |
| Unit tests | **Vitest** | Fast, Vite-native |
| E2E + screenshots | **Playwright** (headless Chromium) | Drives the web build, captures observable-outcome screenshots for the Verifier |
| Lint/format | **ESLint + Prettier** | Deterministic battery |
| Web hosting (sharing) | **Netlify or Vercel or GitHub Pages** (free static) | Deploy the web build → shareable link for parents |
| Executor | **Codex** (swappable — model-agnostic) | Runs in a restricted workspace against the GitHub repo, returns PRs |

**Leanness rule:** no new dependency without explicit approval (an unsanctioned package is a scope violation → Verifier FAIL). Prefer the platform/native feature and what's already installed. Reuse v1's curriculum and MP3s rather than regenerating.

## System Overview / Component Map

```
src/
├── main.tsx                 # app entry
├── App.tsx                  # router + top-level layout
├── data/
│   └── lessons.ts           # REUSED from v1 — the curriculum (10 lessons, ~86 words) + helpers
├── audio/
│   └── player.ts            # slugify(text) -> /audio/{af|en}/{slug}.mp3 ; play/stop; single-source-of-truth
├── storage/
│   └── progress.ts          # PORTED from v1 progress.ts, but backed by Capacitor Preferences
├── screens/
│   ├── Home.tsx             # name entry + progress overview
│   ├── LessonSelect.tsx     # levels, lock/unlock, direction toggle
│   ├── GameSelect.tsx       # pick a game for a lesson
│   ├── GamePlay.tsx         # hosts the active game
│   └── Results.tsx          # score + stars
├── games/
│   ├── Flashcards.tsx       # M3 — the FIRST game pattern (needs-human-check)
│   ├── ListenChoose.tsx     # M4
│   ├── MatchPairs.tsx       # M5
│   └── SpellIt.tsx          # M6
└── components/              # shared UI (buttons, cards, progress bar)

public/
└── audio/
    ├── af/                  # REUSED — 86 Afrikaans MP3s (edge-tts af-ZA)
    └── en/                  # REUSED — 84 English MP3s (edge-tts en-ZA)

android/                     # Capacitor-generated native project (built/opened in Android Studio on YOUR machine)
```

## Data Models

Reused from v1 (`src/data/lessons.ts`):

```ts
interface Word   { en: string; af: string; emoji: string }
interface Lesson { id: number; level: number; title: string; titleAf: string; icon: string; words: Word[] }
type Direction = "en-af" | "af-en"
type GameId = "flashcards" | "match" | "listen" | "spell"
```

Progress (on-device only), key/value via Capacitor Preferences:

```
tweetalig-playerName            -> string (child's first name; NEVER leaves the device)
tweetalig-progress              -> JSON: { "<direction>-<lessonId>-<gameId>": bestScore(0-100) }
```

Level unlock rule (ported): Level 1 always unlocked; Level N unlocked when the average best score across Level N-1 lessons ≥ 40. Stars: 🥉 ≥50, 🥈 ≥70, ⭐ ≥90.

## Audio System (the core design decision)

- Every word maps deterministically to a file: `slugify(word)` → `/audio/{af|en}/{slug}.mp3`. The slugify function (accent-folding for ë ê î ô û á é è ï, strip apostrophes, spaces→hyphens) is **the single source of truth** and must match the filenames exactly. It is reused verbatim from v1's `tts.ts` playback util and is covered by a unit test that asserts every word in `lessons.ts` resolves to a file that exists on disk.
- Playback: one active `HTMLAudioElement` at a time; playing a new word stops the previous.
- **No live TTS at runtime.** Web Speech API is NOT used as a silent fallback (it was in v1) — a missing file must fail loudly in tests, not paper over itself in production. If a file is ever missing, that's a build-time bug caught by the slugify coverage test.
- Voice upgrade (warmer Azure/Google af-ZA audio) is a swappable, PARKED future step: regenerate the files, drop them in `public/audio/`, done. The provider is a replaceable part.

## API Design

None. There is no backend and no runtime network dependency. This is a deliberate, security-simplifying property (see the "never-lean-able" security floor): no auth surface, no secrets, no injection surface, no PII in transit.

## Key Patterns & Conventions

- **Offline-first:** everything the app needs is bundled. Core use works in airplane mode. Any future network feature must degrade gracefully to offline.
- **On-device only:** no data leaves the phone. The only stored personal item is a first name, local.
- **One audio source of truth:** all playback goes through `audio/player.ts`. No component builds its own file path.
- **Progress access through `storage/progress.ts` only.** No component reads Preferences directly.
- **Accessibility floor (never-lean-able):** large tap targets, labels on interactive controls, visible focus, colour-plus-icon (never colour alone) — this is a kids' app.
- **Capacitor discipline:** web code stays platform-agnostic; native concerns isolated. `npx cap sync` after web changes that affect the native bundle.
