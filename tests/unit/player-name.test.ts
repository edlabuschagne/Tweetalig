import { describe, expect, it } from "vitest";

import { validatePlayerName } from "../../src/storage/player-name";

describe("player name validation", () => {
  it.each(["Mia", "Zoë", "Anne-Marie", "D'Angelo", "Mary Jane"])(
    "accepts the valid name %s",
    (name) => {
      expect(validatePlayerName(name)).toBeNull();
    },
  );

  it.each([
    ["", "Please enter a first name."],
    ["   ", "Please enter a first name."],
    ["Mia123", "Use letters, spaces, apostrophes, or hyphens only."],
    ["A".repeat(25), "Please use 24 characters or fewer."],
  ])("rejects invalid input", (name, message) => {
    expect(validatePlayerName(name)).toBe(message);
  });
});
