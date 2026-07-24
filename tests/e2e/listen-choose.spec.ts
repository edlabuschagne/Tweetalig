import { mkdirSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M4";
const successfulAudioStatuses = [200, 206];

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

async function openListenChoose(page: Page, reverseDirection = false) {
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

  await page.getByRole("button", { name: "Play Listen & Choose" }).click();
  await expect(page.getByTestId("listen-prompt")).toBeVisible();
}

async function currentAnswer(page: Page, reverseDirection: boolean) {
  const raw = await page.getByTestId("listen-prompt").innerText();
  const promptWord = raw.replace(/[“”"]/g, "").trim();
  return reverseDirection ? afToEn[promptWord] : enToAf[promptWord];
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M4-1 renders choices and plays the target word on the hear button", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openListenChoose(page);

  await expect(page.getByTestId("listen-choice")).toHaveCount(4);

  const audioResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/af/rooi.mp3",
  );
  await page.getByRole("button", { name: "Hear the word" }).click();
  expect(successfulAudioStatuses).toContain((await audioResponse).status());

  await page.screenshot({
    path: `${evidenceDirectory}/M4-1-question.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("M4-2 gives positive feedback for correct and corrective feedback for wrong", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openListenChoose(page);

  // Question 1 (Red → Rooi): pick a wrong choice on purpose.
  const wrong = page
    .getByTestId("listen-choice")
    .filter({ hasNotText: "Rooi" })
    .first();
  await wrong.click();
  await expect(page.getByTestId("listen-feedback")).toContainText(
    "the answer is “Rooi”",
  );
  await page.screenshot({
    path: `${evidenceDirectory}/M4-2-wrong.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Next word →" }).click();

  // Question 2 (Blue → Blou): pick the correct choice.
  const answer = await currentAnswer(page, false);
  await page.getByTestId("listen-choice").filter({ hasText: answer }).click();
  await expect(page.getByTestId("listen-feedback")).toContainText("Correct");
  await page.screenshot({
    path: `${evidenceDirectory}/M4-2-correct.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});

test("M4-3 completes with a score and works Afrikaans to English", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openListenChoose(page);

  for (let i = 0; i < 8; i++) {
    const answer = await currentAnswer(page, false);
    await page.getByTestId("listen-choice").filter({ hasText: answer }).click();
    await page
      .getByRole("button", { name: i === 7 ? "Finish round" : "Next word →" })
      .click();
  }

  await expect(
    page.getByRole("heading", { name: "Great learning!" }),
  ).toBeVisible();
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M4-3-results.png`,
    fullPage: true,
  });

  // Reverse direction: Rooi → Red, English audio.
  await openListenChoose(page, true);
  const audioResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/en/red.mp3",
  );
  await page.getByRole("button", { name: "Hear the word" }).click();
  expect(successfulAudioStatuses).toContain((await audioResponse).status());

  const answer = await currentAnswer(page, true);
  await page.getByTestId("listen-choice").filter({ hasText: answer }).click();
  await expect(page.getByTestId("listen-feedback")).toContainText("Correct");
  await page.screenshot({
    path: `${evidenceDirectory}/M4-3-af-en.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
