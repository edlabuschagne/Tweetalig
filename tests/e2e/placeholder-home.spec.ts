import { existsSync } from "node:fs";

import { expect, test } from "@playwright/test";

test("M0-3 renders the Tweetalig placeholder without console errors", async ({
  page,
}) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Tweetalig", level: 1 }),
  ).toBeVisible();
  const screenshotPath = "verification-shots/M0/M0-3-placeholder-home.png";
  if (!existsSync(screenshotPath)) {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }

  expect(errors).toEqual([]);
});
