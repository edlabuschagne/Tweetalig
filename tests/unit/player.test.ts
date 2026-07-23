import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getActiveAudio,
  playWord,
  slugify,
  stopAudio,
} from "../../src/audio/player";

class FakeAudio {
  static instances: FakeAudio[] = [];

  currentTime = 0;
  paused = true;
  readonly src: string;

  constructor(src: string) {
    this.src = src;
    FakeAudio.instances.push(this);
  }

  addEventListener() {}

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }
}

describe("audio player", () => {
  beforeEach(() => {
    FakeAudio.instances = [];
    vi.stubGlobal("Audio", FakeAudio);
  });

  afterEach(() => {
    stopAudio();
    vi.unstubAllGlobals();
  });

  it.each([
    ["Goeie môre", "goeie-more"],
    ["Where is the", "where-is-the"],
    ["I don't know", "i-dont-know"],
    ["Reën", "reen"],
    ["Voël", "voel"],
  ])("slugifies %s as %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("stops the active word before playing the next", async () => {
    await playWord("Red", "en");
    const firstAudio = FakeAudio.instances[0];

    await playWord("Blue", "en");
    const secondAudio = FakeAudio.instances[1];

    expect(firstAudio.paused).toBe(true);
    expect(firstAudio.currentTime).toBe(0);
    expect(secondAudio.paused).toBe(false);
    expect(getActiveAudio()).toBe(secondAudio);
    expect(FakeAudio.instances.filter((audio) => !audio.paused)).toHaveLength(
      1,
    );
  });
});
