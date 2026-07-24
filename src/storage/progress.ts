import { Preferences } from "@capacitor/preferences";

import type { Direction, GameId, Lesson } from "../data/lessons";

// Best score (0–100) per direction+lesson+game, persisted locally.
// Shape: { "<direction>-<lessonId>-<gameId>": bestScore }.
export const progressStorageKey = "tweetalig-progress";

export type ProgressMap = Record<string, number>;

// Average of prior-level lesson-bests needed to open the next level.
export const levelUnlockThreshold = 40;

export function progressKey(
  direction: Direction,
  lessonId: number,
  gameId: GameId,
): string {
  return `${direction}-${lessonId}-${gameId}`;
}

// Best-only merge: keep the higher score, never regress. Returns the SAME
// reference when nothing changed, so callers can skip a redundant write.
export function mergeBest(
  map: ProgressMap,
  key: string,
  score: number,
): ProgressMap {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped <= (map[key] ?? 0)) return map;
  return { ...map, [key]: clamped };
}

// The best score across all games for one lesson+direction, or null if the
// child has never recorded a score for that lesson.
export function lessonBest(
  map: ProgressMap,
  direction: Direction,
  lessonId: number,
  gameIds: readonly GameId[],
): number | null {
  const scores = gameIds
    .map((gameId) => map[progressKey(direction, lessonId, gameId)])
    .filter((value): value is number => typeof value === "number");
  return scores.length ? Math.max(...scores) : null;
}

// Average of the recorded lesson-bests within a level (played lessons only).
// 0 when nothing in that level has been played yet.
export function levelAverage(
  map: ProgressMap,
  direction: Direction,
  level: number,
  lessons: readonly Lesson[],
  gameIds: readonly GameId[],
): number {
  const bests = lessons
    .filter((lesson) => lesson.level === level)
    .map((lesson) => lessonBest(map, direction, lesson.id, gameIds))
    .filter((value): value is number => value !== null);
  if (bests.length === 0) return 0;
  return bests.reduce((sum, value) => sum + value, 0) / bests.length;
}

// Level 1 is always open; level N opens when the average of played lesson-bests
// in level N-1 reaches the threshold.
export function isLevelUnlocked(
  map: ProgressMap,
  direction: Direction,
  level: number,
  lessons: readonly Lesson[],
  gameIds: readonly GameId[],
): boolean {
  if (level <= 1) return true;
  return (
    levelAverage(map, direction, level - 1, lessons, gameIds) >=
    levelUnlockThreshold
  );
}

export function starFor(score: number): string | null {
  if (score >= 90) return "⭐";
  if (score >= 70) return "🥈";
  if (score >= 50) return "🥉";
  return null;
}

// Count of lesson-bests recorded across both directions — a simple "lessons
// practised" tally for the Home summary.
export function lessonsPracticed(
  map: ProgressMap,
  directions: readonly Direction[],
  lessons: readonly Lesson[],
  gameIds: readonly GameId[],
): number {
  let count = 0;
  for (const direction of directions) {
    for (const lesson of lessons) {
      if (lessonBest(map, direction, lesson.id, gameIds) !== null) count += 1;
    }
  }
  return count;
}

// --- Preferences-backed persistence (mirrors storage/player-name.ts) ---

export async function getProgress(): Promise<ProgressMap> {
  const { value } = await Preferences.get({ key: progressStorageKey });
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    // Keep only finite numeric entries — guard against a corrupt/partial write
    // so a bad value can never crash the app (offline data integrity).
    const clean: ProgressMap = {};
    for (const [key, entry] of Object.entries(parsed)) {
      if (typeof entry === "number" && Number.isFinite(entry)) {
        clean[key] = entry;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export async function saveScore(
  direction: Direction,
  lessonId: number,
  gameId: GameId,
  score: number,
): Promise<ProgressMap> {
  const map = await getProgress();
  const next = mergeBest(map, progressKey(direction, lessonId, gameId), score);
  if (next !== map) {
    await Preferences.set({
      key: progressStorageKey,
      value: JSON.stringify(next),
    });
  }
  return next;
}
