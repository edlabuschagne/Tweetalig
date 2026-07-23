import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { lessons } from "../../src/data/lessons";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

describe("bundled lesson audio", () => {
  it("maps every English and Afrikaans word to an existing MP3", () => {
    const expectedFiles = lessons.flatMap((lesson) =>
      lesson.words.flatMap((word) => [
        resolve("public", "audio", "en", `${slugify(word.en)}.mp3`),
        resolve("public", "audio", "af", `${slugify(word.af)}.mp3`),
      ]),
    );

    const missingFiles = expectedFiles.filter((file) => !existsSync(file));

    expect(expectedFiles).toHaveLength(164);
    expect(missingFiles).toEqual([]);
  });
});
