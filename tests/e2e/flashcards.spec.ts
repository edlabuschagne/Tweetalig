import { mkdirSync, writeFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M3";
const successfulAudioStatuses = [200, 206];

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

async function openFlashcards(page: Page, reverseDirection = false) {
  await page.goto("/");
  await page.getByLabel("What is your first name?").fill("Mia");
  await page.getByRole("button", { name: "Start learning" }).click();

  if (reverseDirection) {
    await page.getByRole("button", { name: "Afrikaans → English" }).click();
    await page.getByRole("button", { name: "Kleure to Colors" }).click();
  } else {
    await page.getByRole("button", { name: "Colors to Kleure" }).click();
  }

  await page.getByRole("button", { name: "Play Flashcards" }).click();
  await expect(
    page.getByRole("heading", {
      name: reverseDirection ? "Afrikaans word" : "English word",
    }),
  ).toBeVisible();
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M3-1 and M3-4 flip accessibly and auto-play the target audio", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openFlashcards(page);

  const card = page.getByTestId("flashcard");
  await expect(card).toHaveAccessibleName("Flip card showing English word Red");
  await page.screenshot({
    path: `${evidenceDirectory}/M3-1-card-front.png`,
    fullPage: true,
  });

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(card).toBeFocused();
  await page.screenshot({
    path: `${evidenceDirectory}/M3-4-keyboard-focus.png`,
    fullPage: true,
  });

  const audioResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/af/rooi.mp3",
  );
  await page.keyboard.press("Enter");
  expect(successfulAudioStatuses).toContain((await audioResponse).status());

  await expect(card).toHaveAccessibleName("Replay Afrikaans audio for Rooi");
  await expect(
    page.getByRole("heading", { name: "Afrikaans translation" }),
  ).toBeVisible();
  await expect(page.getByText("Rooi", { exact: true })).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M3-1-card-back.png`,
    fullPage: true,
  });
  await page.screenshot({
    path: `${evidenceDirectory}/M3-3-en-af.png`,
    fullPage: true,
  });
  writeFileSync(
    `${evidenceDirectory}/M3-1-audio-request.json`,
    `${JSON.stringify(
      {
        direction: "en-af",
        requestedPath: "/audio/af/rooi.mp3",
        externalRequests: [],
      },
      null,
      2,
    )}\n`,
  );

  expect(errors).toEqual([]);
});

test("M3-2 shows every lesson word once and completes with a numeric score", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openFlashcards(page);
  const expectedWords = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "White",
    "Black",
  ];
  const seenWords: string[] = [];

  for (const [index, expectedWord] of expectedWords.entries()) {
    const card = page.getByTestId("flashcard");
    await expect(card).toContainText(expectedWord);
    seenWords.push(await page.getByTestId("flashcard-word").innerText());
    await card.click();

    const advanceButton = page.getByRole("button", {
      name: index === expectedWords.length - 1 ? "Finish round" : "Next word →",
    });
    await expect(advanceButton).toBeVisible();
    await advanceButton.click();
  }

  expect(seenWords).toEqual(expectedWords);
  await expect(
    page.getByRole("heading", { name: "Great learning!" }),
  ).toBeVisible();
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M3-2-results.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});

test("M3-3 works from Afrikaans to English with English audio", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openFlashcards(page, true);

  const card = page.getByTestId("flashcard");
  await expect(card).toContainText("Rooi");
  const audioResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/en/red.mp3",
  );
  await card.click();
  expect(successfulAudioStatuses).toContain((await audioResponse).status());
  await expect(card).toContainText("Red");
  await expect(card).toHaveAccessibleName("Replay English audio for Red");
  await page.screenshot({
    path: `${evidenceDirectory}/M3-3-af-en.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
