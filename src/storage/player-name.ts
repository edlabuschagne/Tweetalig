import { Preferences } from "@capacitor/preferences";

export const playerNameKey = "tweetalig-playerName";
export const playerNameMaxLength = 24;

export function validatePlayerName(value: string): string | null {
  const name = value.trim();

  if (!name) return "Please enter a first name.";
  if (name.length > playerNameMaxLength) {
    return `Please use ${playerNameMaxLength} characters or fewer.`;
  }
  if (!/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(name)) {
    return "Use letters, spaces, apostrophes, or hyphens only.";
  }

  return null;
}

export async function getPlayerName(): Promise<string | null> {
  const { value } = await Preferences.get({ key: playerNameKey });
  return value;
}

export async function savePlayerName(value: string): Promise<string> {
  const name = value.trim();
  const error = validatePlayerName(name);
  if (error) throw new Error(error);

  await Preferences.set({ key: playerNameKey, value: name });
  return name;
}
