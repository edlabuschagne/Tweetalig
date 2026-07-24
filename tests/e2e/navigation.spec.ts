import { existsSync, mkdirSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M2";

async function captureM2(page: Page, filename: string) {
  const path = `${evidenceDirectory}/${filename}`;
  if (!existsSync(path)) await page.screenshot({ path, fullPage: true });
}

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

async function enterName(page: Page, name = "Mia") {
  await page.getByLabel("What is your first name?").fill(name);
  await page.getByRole("button", { name: "Start learning" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a lesson" }),
  ).toBeVisible();
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M2-1 saves a validated first name locally across reload", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Tweetalig", level: 1 }),
  ).toBeVisible();
  await captureM2(page, "M2-1-home-empty.png");

  await page.getByRole("button", { name: "Start learning" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Please enter a first name.",
  );
  await enterName(page, "  Mia  ");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Welcome back, Mia!" }),
  ).toBeVisible();
  await expect(page.getByText("Saved only on this device.")).toHaveCount(0);
  await captureM2(page, "M2-1-home-named.png");

  expect(errors).toEqual([]);
});

test("M2-2 and M2-3 show 10 lessons, lock later levels, and toggle direction", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await page.goto("/");
  await enterName(page);

  await expect(page.getByTestId("lesson-card")).toHaveCount(10);
  await expect(page.getByRole("button", { name: /locked$/ })).toHaveCount(6);
  await expect(page.getByTestId("direction-label")).toHaveText(
    "Learning: English → Afrikaans",
  );
  await expect(
    page.getByRole("button", { name: "Colors to Kleure" }),
  ).toBeEnabled();
  await captureM2(page, "M2-2-lesson-locks.png");
  await captureM2(page, "M2-3-direction-en-af.png");

  await page.getByRole("button", { name: "Afrikaans → English" }).click();
  await expect(page.getByTestId("direction-label")).toHaveText(
    "Learning: Afrikaans → English",
  );
  await expect(
    page.getByRole("button", { name: "Kleure to Colors" }),
  ).toBeEnabled();
  await captureM2(page, "M2-3-direction-af-en.png");

  expect(errors).toEqual([]);
});

test("M2-4 opens four game tiles without building the games", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await page.goto("/");
  await enterName(page);
  await page.getByRole("button", { name: "Colors to Kleure" }).click();

  await expect(
    page.getByRole("heading", { name: "Choose a game" }),
  ).toBeVisible();
  await expect(page.getByTestId("game-tile")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Flashcards" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Match Pairs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Listen & Choose" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spell It" })).toBeVisible();
  await captureM2(page, "M2-4-game-select.png");

  expect(errors).toEqual([]);
});
