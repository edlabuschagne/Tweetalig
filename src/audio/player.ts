export type AudioLanguage = "af" | "en";

let activeAudio: HTMLAudioElement | null = null;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function audioPath(text: string, language: AudioLanguage): string {
  return `/audio/${language}/${slugify(text)}.mp3`;
}

export function stopAudio(): void {
  if (!activeAudio) return;

  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

export async function playWord(
  text: string,
  language: AudioLanguage,
): Promise<HTMLAudioElement> {
  stopAudio();

  const audio = new Audio(audioPath(text, language));
  activeAudio = audio;

  audio.addEventListener(
    "ended",
    () => {
      if (activeAudio === audio) activeAudio = null;
    },
    { once: true },
  );

  try {
    await audio.play();
    return audio;
  } catch (error) {
    if (activeAudio !== audio) return audio;

    activeAudio = null;
    throw error;
  }
}

export function getActiveAudio(): HTMLAudioElement | null {
  return activeAudio;
}
