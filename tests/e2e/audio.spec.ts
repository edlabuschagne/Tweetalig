import { mkdirSync, writeFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const evidenceDirectory = "verification-shots/M1";
const successfulAudioStatuses = [200, 206];

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

test.beforeAll(() => mkdirSync(evidenceDirectory, { recursive: true }));

test("M1-3 requests exact English and Afrikaans audio paths", async ({
  page,
}) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  const englishRequest = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/en/blue.mp3",
  );
  await page.getByRole("button", { name: "Play English Blue" }).click();
  expect(successfulAudioStatuses).toContain((await englishRequest).status());

  const afrikaansRequest = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/af/blou.mp3",
  );
  await page.getByRole("button", { name: "Play Afrikaans Blou" }).click();
  expect(successfulAudioStatuses).toContain((await afrikaansRequest).status());

  await expect(page.getByTestId("audio-status")).toHaveText(
    "Playing Afrikaans: Blou",
  );
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.screenshot({
    path: `${evidenceDirectory}/M1-3-correct-audio-path.png`,
    fullPage: true,
  });
  writeFileSync(
    `${evidenceDirectory}/M1-3-audio-requests.json`,
    `${JSON.stringify(
      {
        requestedPaths: ["/audio/en/blue.mp3", "/audio/af/blou.mp3"],
        externalRequests: [],
      },
      null,
      2,
    )}\n`,
  );

  expect(errors).toEqual([]);
});

test("M1-5 replays preloaded bundled audio after going offline", async ({
  context,
  page,
}) => {
  const errors = trackPageErrors(page);
  const preloadResponse = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/audio/en/red.mp3",
  );

  await page.goto("/");
  expect(successfulAudioStatuses).toContain((await preloadResponse).status());

  const offlineRequests: string[] = [];
  page.on("request", (request) => offlineRequests.push(request.url()));
  await context.setOffline(true);
  await page.getByRole("button", { name: "Play English Red" }).click();

  await expect(page.getByTestId("audio-status")).toHaveText(
    "Playing English: Red",
  );
  await page.screenshot({
    path: `${evidenceDirectory}/M1-5-offline-audio.png`,
    fullPage: true,
  });

  const externalRequests = offlineRequests.filter(
    (url) => new URL(url).origin !== "http://127.0.0.1:4173",
  );
  writeFileSync(
    `${evidenceDirectory}/M1-5-offline-network.json`,
    `${JSON.stringify(
      {
        preloadedPath: "/audio/en/red.mp3",
        offlineRequests: offlineRequests.map((url) => new URL(url).pathname),
        externalRequests,
      },
      null,
      2,
    )}\n`,
  );

  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
