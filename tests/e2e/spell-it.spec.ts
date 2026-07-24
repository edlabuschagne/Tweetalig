import { mkdirSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M6";

// English -> Afrikaans for the two Level-1 lessons this spec exercises.
const enToAf: Record<string, string> = {
  // Colors
  Red: "Rooi",
  Blue: "Blou",
  Green: "Groen",
  Yellow: "Geel",
  Orange: "Oranje",
  Purple: "Pers",
  White: "Wit",
  Black: "Swart",
  // Animals (Bird -> Voël carries the accent used for M6-1)
  Dog: "Hond",
  Cat: "Kat",
  Bird: "Voël",
  Fish: "Vis",
  Horse: "Perd",
  Cow: "Koei",
  Sheep: "Skaap",
  Lion: "Leeu",
};
const afToEn: Record<string, string> = Object.fromEntries(
  Object.entries(enToAf).map(([en, af]) => [af, en]),
);

function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function openSpellIt(page: Page, lessonButton: string, reverse = false) {
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

  if (reverse) {
    await page.getByRole("button", { name: "Afrikaans → English" }).click();
  }
  await page.getByRole("button", { name: lessonButton }).click();
  await page.getByRole("button", { name: "Play Spell It" }).click();
  await expect(page.getByTestId("spell-prompt")).toBeVisible();
}

async function promptWord(page: Page): Promise<string> {
  const raw = await page.getByTestId("spell-prompt").innerText();
  return raw.replace(/[“”"]/g, "").trim();
}

function answerFor(word: string, reverse: boolean): string {
  return reverse ? afToEn[word] : enToAf[word];
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M6-1 accepts an accent-insensitive answer as correct", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  // Animals reaches Bird -> Voël; type "voel" (no diaeresis) at that question.
  await openSpellIt(page, "Animals to Diere");

  for (let i = 0; i < 8; i++) {
    const word = await promptWord(page);
    const answer = answerFor(word, false);
    // Bird is the accent case: deliberately omit the accent on the guess.
    const typed = word === "Bird" ? stripAccents(answer) : answer;
    await page.getByTestId("spell-input").fill(typed);
    await page.getByRole("button", { name: "Check" }).click();

    if (word === "Bird") {
      expect(typed).toBe("Voel"); // proves the accent was dropped in the guess
      await expect(page.getByTestId("spell-feedback")).toContainText("Correct");
      await page.screenshot({
        path: `${evidenceDirectory}/M6-1-accent-correct.png`,
        fullPage: true,
      });
    }
    await page
      .getByRole("button", { name: i === 7 ? "Finish round" : "Next word →" })
      .click();
  }

  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  expect(errors).toEqual([]);
});

test("M6-2 reveals the correct spelling after a wrong answer", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await openSpellIt(page, "Colors to Kleure");

  // Question 1 (Red -> Rooi): type something clearly wrong.
  await page.getByTestId("spell-input").fill("xyz");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByTestId("spell-feedback")).toContainText("Rooi");
  await expect(page.getByTestId("spell-feedback")).toContainText("Not quite");
  await page.screenshot({
    path: `${evidenceDirectory}/M6-2-wrong.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});

test("M6-3 completes to Results with a score in both directions", async ({
  page,
}) => {
  const errors = trackPageErrors(page);

  // English -> Afrikaans: spell all eight correctly.
  await openSpellIt(page, "Colors to Kleure");
  for (let i = 0; i < 8; i++) {
    const word = await promptWord(page);
    await page.getByTestId("spell-input").fill(answerFor(word, false));
    await page.getByRole("button", { name: "Check" }).click();
    await page
      .getByRole("button", { name: i === 7 ? "Finish round" : "Next word →" })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Great learning!" }),
  ).toBeVisible();
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M6-3-results.png`,
    fullPage: true,
  });

  // Afrikaans -> English.
  await openSpellIt(page, "Kleure to Colors", true);
  for (let i = 0; i < 8; i++) {
    const word = await promptWord(page);
    await page.getByTestId("spell-input").fill(answerFor(word, true));
    await page.getByRole("button", { name: "Check" }).click();
    await page
      .getByRole("button", { name: i === 7 ? "Finish round" : "Next word →" })
      .click();
  }
  await expect(page.getByLabel("Score 100 out of 100")).toBeVisible();
  await page.screenshot({
    path: `${evidenceDirectory}/M6-3-af-en.png`,
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
