// Forgiving spelling checker for the Spell It game.
//
// A young learner shouldn't be marked wrong for a missing accent, a stray
// capital, extra spaces, or trailing punctuation. We normalise both the guess
// and the answer to a comparable core: lowercase, accents folded, apostrophes
// dropped, everything that isn't a letter or space removed, whitespace
// collapsed. Spaces are KEPT so multi-word phrases ("Hoe gaan dit?") still
// compare word-for-word.

export function normalizeSpelling(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // fold diacritics: môre -> more
    .replace(/['’]/g, "") // drop apostrophes
    .replace(/[^a-z\s]/g, "") // drop punctuation, digits, symbols; keep spaces
    .replace(/\s+/g, " ") // collapse runs of whitespace
    .trim();
}

export function isSpellingCorrect(guess: string, answer: string): boolean {
  const normalizedGuess = normalizeSpelling(guess);
  // An empty (or whitespace/punctuation-only) guess is never correct.
  if (normalizedGuess.length === 0) return false;
  return normalizedGuess === normalizeSpelling(answer);
}
