import { mkdirSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M7";

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

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

// Land on LessonSelect from a cold Home (fills the name on first visit,
// "Continue learning" thereafter).
async function gotoLessons(page: Page) {
  await page.goto("/");
  const nameField = page.getByLabel("What is your first name?");
  const continueButton = page.getByRole("button", {
    name: "Continue learning",
  });
  await expect(nameField.or(continueButton)).toBeVisible();
  if (await nameField.isVisible()) {
    await nameField.fill("Mia");
    await page.getByRole("button", { name: "Start learning" }).click();
  } else {
    await continueButton.click();
  }
}

// Play the Colors Flashcards round to completion (Flashcards always scores 100).
async function playColorsFlashcards(page: Page) {
  await gotoLessons(page);
  await page.getByRole("button", { name: "Colors to Kleure" }).click();
  await page.getByRole("button", { name: "Play Flashcards" }).click();
  for (let i = 0; i < 8; i++) {
    await page.getByTestId("flashcard").click();
    await page
      .getByRole("button", { name: i === 7 ? "Finish round" : "Next word →" })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Great learning!" }),
  ).toBeVisible();
}

// Play Colors Listen & Choose, missing exactly `wrongCount` of the 8 questions,
// to land on a chosen score band. Score = round((8 - wrongCount) / 8 * 100).
async function playColorsListen(page: Page, wrongCount: number) {
  await gotoLessons(page);
  await page.getByRole("button", { name: "Colors to Kleure" }).click();
  await page.getByRole("button", { name: "Play Listen & Choose" }).click();
  for (let i = 0; i < 8; i++) {
    const raw = await page.getByTestId("listen-prompt").innerText();
    const answer = enToAf[raw.replace(/[“”"]/g, "").trim()];
    if (i < wrongCount) {
      await page
        .getByTestId("listen-choice")
        .filter({ hasNotText: answer })
        .first()
        .click();
    } else {
      await page
        .getByTestId("listen-choice")
        .filter({ hasText: answer })
        .click();
    }
    await page
      .getByRole("button", { name: i === 7 ? "Finish round" : "Next word →" })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Great learning!" }),
  ).toBeVisible();
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M7-2 and M7-4 progress persists across reload and unlocks Level 2", async ({
  page,
}) => {
  const errors = trackPageErrors(page);

  await playColorsFlashcards(page); // scores 100 on a Level-1 lesson

  // Reload the whole app: state resets, but Preferences-backed progress must
  // survive (M7-4). App returns to Home for the returning player.
  await page.reload();
  const homeProgress = page.getByTestId("home-progress");
  await expect(homeProgress).toContainText("practised");
  await page.screenshot({
    path: `${evidenceDirectory}/M7-4-home-progress.png`,
    fullPage: true,
  });

  await page.getByRole("button", { name: "Continue learning" }).click();

  // Level 2 was locked on a fresh install (M2); it is now unlocked (M7-2).
  const level2Lesson = page.getByRole("button", {
    name: "Body Parts to Liggaamsdele",
  });
  await expect(level2Lesson).toBeEnabled();
  await page.screenshot({
    path: `${evidenceDirectory}/M7-2-level2-unlocked.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});

test("M7-3 Results shows the correct star at each threshold", async ({
  page,
}) => {
  const errors = trackPageErrors(page);

  // Gold: 8/8 = 100 (>= 90).
  await playColorsListen(page, 0);
  await expect(page.getByTestId("results-star")).toContainText("Gold");
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M7-3-gold.png`,
    fullPage: true,
  });

  // Silver: 6/8 = 75 (70–89).
  await playColorsListen(page, 2);
  await expect(page.getByTestId("results-star")).toContainText("Silver");
  await expect(page.getByLabel("Score 75 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M7-3-silver.png`,
    fullPage: true,
  });

  // Bronze: 4/8 = 50 (50–69).
  await playColorsListen(page, 4);
  await expect(page.getByTestId("results-star")).toContainText("Bronze");
  await expect(page.getByLabel("Score 50 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M7-3-bronze.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
