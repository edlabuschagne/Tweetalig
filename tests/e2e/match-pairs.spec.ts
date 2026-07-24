import { mkdirSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M5";

const enToAf: Record<string, string> = {
  Red: "Rooi",
  Blue: "Blou",
  Green: "Groen",
  Yellow: "Geel",
  Orange: "Oranje",
  Purple: "Pers",
  White: "Wit",
  Black: "Swart",
};
const afToEn: Record<string, string> = Object.fromEntries(
  Object.entries(enToAf).map(([en, af]) => [af, en]),
);

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function openMatchPairs(page: Page, reverseDirection = false) {
  await page.goto("/");
  const nameField = page.getByLabel("What is your first name?");
  const continueButton = page.getByRole("button", {
    name: "Continue learning",
  });
  // Wait for Home to settle past its async loading state before branching.
  await expect(nameField.or(continueButton)).toBeVisible();
  if (await nameField.isVisible()) {
    await nameField.fill("Mia");
    await page.getByRole("button", { name: "Start learning" }).click();
  } else {
    await continueButton.click();
  }

  if (reverseDirection) {
    await page.getByRole("button", { name: "Afrikaans → English" }).click();
    await page.getByRole("button", { name: "Kleure to Colors" }).click();
  } else {
    await page.getByRole("button", { name: "Colors to Kleure" }).click();
  }

  await page.getByRole("button", { name: "Play Match Pairs" }).click();
  await expect(page.getByTestId("match-feedback")).toBeVisible();
  await expect(page.getByTestId("match-from")).toHaveCount(6);
}

// The visible word for a tile, with the ✓/✗ status glyphs stripped out.
async function fromWords(page: Page): Promise<string[]> {
  const tiles = page.getByTestId("match-from");
  const count = await tiles.count();
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = await tiles.nth(i).innerText();
    words.push(raw.replace(/[✓✗]/g, "").trim());
  }
  return words;
}

function translate(word: string, reverseDirection: boolean): string {
  return reverseDirection ? afToEn[word] : enToAf[word];
}

// Tiles carry the word as their accessible name (the ✓/✗ glyphs are
// aria-hidden), so getByRole selects the button itself, not its inner span.
async function matchPair(page: Page, fromWord: string, toWord: string) {
  await page.getByRole("button", { name: fromWord, exact: true }).click();
  await page.getByRole("button", { name: toWord, exact: true }).click();
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M5-1 locks a correct pair as matched", async ({ page }) => {
  const errors = trackPageErrors(page);
  await openMatchPairs(page);

  await page.screenshot({
    path: `${evidenceDirectory}/M5-1-before.png`,
    fullPage: true,
  });

  const [firstWord] = await fromWords(page);
  const answer = translate(firstWord, false);
  await matchPair(page, firstWord, answer);

  // Both tiles of the pair are now locked: disabled and marked with ✓.
  const fromTile = page.getByRole("button", { name: firstWord, exact: true });
  const toTile = page.getByRole("button", { name: answer, exact: true });
  await expect(fromTile).toBeDisabled();
  await expect(toTile).toBeDisabled();
  await expect(fromTile).toContainText("✓");
  await expect(page.getByTestId("match-feedback")).not.toContainText(
    "Not a match",
  );

  await page.screenshot({
    path: `${evidenceDirectory}/M5-1-after.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("M5-2 resets a mismatched pair", async ({ page }) => {
  const errors = trackPageErrors(page);
  await openMatchPairs(page);

  const words = await fromWords(page);
  const firstWord = words[0];
  // A translation that belongs to a DIFFERENT word — a deliberate mismatch.
  const wrongAnswer = translate(words[1], false);
  await matchPair(page, firstWord, wrongAnswer);

  await expect(page.getByTestId("match-feedback")).toContainText("Not a match");
  await page.screenshot({
    path: `${evidenceDirectory}/M5-2-mismatch.png`,
    fullPage: true,
  });

  // Neither tile locks: both remain enabled and can still be matched correctly.
  const fromTile = page.getByRole("button", { name: firstWord, exact: true });
  const wrongTile = page.getByRole("button", {
    name: wrongAnswer,
    exact: true,
  });
  await expect(fromTile).toBeEnabled();
  await expect(wrongTile).toBeEnabled();

  // The next tap clears the red state, and the correct pairing still works.
  await matchPair(page, firstWord, translate(firstWord, false));
  await expect(fromTile).toBeDisabled();
  await expect(page.getByTestId("match-feedback")).not.toContainText(
    "Not a match",
  );

  expect(errors).toEqual([]);
});

test("M5-3 completes all pairs to Results with a score in both directions", async ({
  page,
}) => {
  const errors = trackPageErrors(page);

  // English → Afrikaans: match every pair cleanly for a perfect score.
  await openMatchPairs(page);
  for (const word of await fromWords(page)) {
    await matchPair(page, word, translate(word, false));
  }
  await expect(
    page.getByRole("heading", { name: "Great learning!" }),
  ).toBeVisible();
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M5-3-results.png`,
    fullPage: true,
  });

  // Afrikaans → English: same flow, translations reversed.
  await openMatchPairs(page, true);
  for (const word of await fromWords(page)) {
    await matchPair(page, word, translate(word, true));
  }
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M5-3-af-en.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
