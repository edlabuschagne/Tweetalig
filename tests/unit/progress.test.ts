import { describe, expect, it } from "vitest";

import { lessons } from "../../src/data/lessons";
import {
  isLevelUnlocked,
  lessonBest,
  levelAverage,
  mergeBest,
  progressKey,
  starFor,
  type ProgressMap,
} from "../../src/storage/progress";

const gameIds = ["flashcards", "match", "listen", "spell"] as const;

describe("mergeBest — best score only increases", () => {
  it("stores a first score", () => {
    const next = mergeBest({}, "k", 60);
    expect(next.k).toBe(60);
  });

  it("keeps the higher score and ignores a lower later score", () => {
    const afterHigh = mergeBest({ k: 80 }, "k", 90);
    expect(afterHigh.k).toBe(90);
    const afterLow = mergeBest(afterHigh, "k", 50);
    expect(afterLow.k).toBe(90);
    expect(afterLow).toBe(afterHigh); // same reference: no write needed
  });

  it("rounds and clamps a stored score into 0–100", () => {
    expect(mergeBest({}, "k", 87.6).k).toBe(88);
    expect(mergeBest({}, "k", 150).k).toBe(100);
  });

  it("never creates or lowers an entry for a non-positive score", () => {
    // A clamped-to-0 score is not a real best, so no entry is written.
    expect(mergeBest({}, "k", -5).k).toBeUndefined();
    expect(mergeBest({ k: 50 }, "k", -5).k).toBe(50);
  });
});

describe("lessonBest — max across games, null when unplayed", () => {
  it("returns null before any play", () => {
    expect(lessonBest({}, "en-af", 1, gameIds)).toBeNull();
  });

  it("takes the maximum across the lesson's games", () => {
    const map: ProgressMap = {
      [progressKey("en-af", 1, "flashcards")]: 70,
      [progressKey("en-af", 1, "spell")]: 95,
    };
    expect(lessonBest(map, "en-af", 1, gameIds)).toBe(95);
  });
});

describe("level unlock at >=40 average", () => {
  it("level 1 is always unlocked", () => {
    expect(isLevelUnlocked({}, "en-af", 1, lessons, gameIds)).toBe(true);
  });

  it("level 2 is locked with no Level-1 progress", () => {
    expect(isLevelUnlocked({}, "en-af", 2, lessons, gameIds)).toBe(false);
  });

  it("level 2 unlocks when the played Level-1 average reaches 40", () => {
    // One Level-1 lesson (Colors, id 1) played at 40 → average 40 → unlock.
    const at40: ProgressMap = { [progressKey("en-af", 1, "flashcards")]: 40 };
    expect(levelAverage(at40, "en-af", 1, lessons, gameIds)).toBe(40);
    expect(isLevelUnlocked(at40, "en-af", 2, lessons, gameIds)).toBe(true);

    // Just below the threshold stays locked.
    const at39: ProgressMap = { [progressKey("en-af", 1, "flashcards")]: 39 };
    expect(isLevelUnlocked(at39, "en-af", 2, lessons, gameIds)).toBe(false);
  });

  it("is direction-specific", () => {
    const enOnly: ProgressMap = {
      [progressKey("en-af", 1, "flashcards")]: 100,
    };
    expect(isLevelUnlocked(enOnly, "en-af", 2, lessons, gameIds)).toBe(true);
    expect(isLevelUnlocked(enOnly, "af-en", 2, lessons, gameIds)).toBe(false);
  });
});

describe("starFor — thresholds 50/70/90", () => {
  it("no star below 50", () => {
    expect(starFor(0)).toBeNull();
    expect(starFor(49)).toBeNull();
  });

  it("bronze at 50–69", () => {
    expect(starFor(50)).toBe("🥉");
    expect(starFor(69)).toBe("🥉");
  });

  it("silver at 70–89", () => {
    expect(starFor(70)).toBe("🥈");
    expect(starFor(89)).toBe("🥈");
  });

  it("gold at 90+", () => {
    expect(starFor(90)).toBe("⭐");
    expect(starFor(100)).toBe("⭐");
  });
});
