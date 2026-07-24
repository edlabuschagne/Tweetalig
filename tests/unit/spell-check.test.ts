import { describe, expect, it } from "vitest";

import {
  isSpellingCorrect,
  normalizeSpelling,
} from "../../src/games/spell-check";

describe("normalizeSpelling", () => {
  it("folds accents, lowercases, and trims", () => {
    expect(normalizeSpelling("  MÔRE ")).toBe("more");
  });

  it("collapses inner whitespace but keeps word boundaries", () => {
    expect(normalizeSpelling("Hoe   gaan  dit")).toBe("hoe gaan dit");
  });

  it("drops trailing punctuation and apostrophes", () => {
    expect(normalizeSpelling("Wat is jou naam?")).toBe("wat is jou naam");
    expect(normalizeSpelling("I don't know")).toBe("i dont know");
  });
});

describe("isSpellingCorrect", () => {
  it("accepts an accent-insensitive answer (M6-1)", () => {
    expect(isSpellingCorrect("more", "môre")).toBe(true);
    expect(isSpellingCorrect("voel", "Voël")).toBe(true);
    expect(isSpellingCorrect("reen", "Reën")).toBe(true);
  });

  it("accepts case and surrounding-whitespace variants", () => {
    expect(isSpellingCorrect("  rOOi ", "Rooi")).toBe(true);
  });

  it("accepts a multi-word phrase ignoring punctuation", () => {
    expect(isSpellingCorrect("hoe gaan dit", "Hoe gaan dit?")).toBe(true);
  });

  it("rejects a genuinely wrong answer", () => {
    expect(isSpellingCorrect("blou", "Rooi")).toBe(false);
  });

  it("rejects an empty or whitespace-only guess", () => {
    expect(isSpellingCorrect("", "Rooi")).toBe(false);
    expect(isSpellingCorrect("   ", "Rooi")).toBe(false);
    expect(isSpellingCorrect("!!", "Rooi")).toBe(false);
  });
});
