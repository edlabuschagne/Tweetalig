export interface Word {
  en: string;
  af: string;
  emoji: string;
}

export interface Lesson {
  id: number;
  level: number;
  title: string;
  titleAf: string;
  icon: string;
  words: Word[];
}

export const lessons: Lesson[] = [
  {
    id: 1, level: 1, title: "Colors", titleAf: "Kleure", icon: "🎨",
    words: [
      { en: "Red", af: "Rooi", emoji: "🔴" },
      { en: "Blue", af: "Blou", emoji: "🔵" },
      { en: "Green", af: "Groen", emoji: "🟢" },
      { en: "Yellow", af: "Geel", emoji: "🟡" },
      { en: "Orange", af: "Oranje", emoji: "🟠" },
      { en: "Purple", af: "Pers", emoji: "🟣" },
      { en: "White", af: "Wit", emoji: "⚪" },
      { en: "Black", af: "Swart", emoji: "⚫" },
    ],
  },
  {
    id: 2, level: 1, title: "Numbers", titleAf: "Nommers", icon: "🔢",
    words: [
      { en: "One", af: "Een", emoji: "1️⃣" },
      { en: "Two", af: "Twee", emoji: "2️⃣" },
      { en: "Three", af: "Drie", emoji: "3️⃣" },
      { en: "Four", af: "Vier", emoji: "4️⃣" },
      { en: "Five", af: "Vyf", emoji: "5️⃣" },
      { en: "Six", af: "Ses", emoji: "6️⃣" },
      { en: "Seven", af: "Sewe", emoji: "7️⃣" },
      { en: "Eight", af: "Agt", emoji: "8️⃣" },
      { en: "Nine", af: "Nege", emoji: "9️⃣" },
      { en: "Ten", af: "Tien", emoji: "🔟" },
    ],
  },
  {
    id: 3, level: 1, title: "Animals", titleAf: "Diere", icon: "🐾",
    words: [
      { en: "Dog", af: "Hond", emoji: "🐕" },
      { en: "Cat", af: "Kat", emoji: "🐈" },
      { en: "Bird", af: "Voël", emoji: "🐦" },
      { en: "Fish", af: "Vis", emoji: "🐟" },
      { en: "Horse", af: "Perd", emoji: "🐴" },
      { en: "Cow", af: "Koei", emoji: "🐄" },
      { en: "Sheep", af: "Skaap", emoji: "🐑" },
      { en: "Lion", af: "Leeu", emoji: "🦁" },
    ],
  },
  {
    id: 4, level: 1, title: "Family", titleAf: "Familie", icon: "👨‍👩‍👧‍👦",
    words: [
      { en: "Mother", af: "Moeder", emoji: "👩" },
      { en: "Father", af: "Vader", emoji: "👨" },
      { en: "Sister", af: "Suster", emoji: "👧" },
      { en: "Brother", af: "Broer", emoji: "👦" },
      { en: "Grandmother", af: "Ouma", emoji: "👵" },
      { en: "Grandfather", af: "Oupa", emoji: "👴" },
      { en: "Baby", af: "Baba", emoji: "👶" },
      { en: "Friend", af: "Vriend", emoji: "🤝" },
    ],
  },
  {
    id: 5, level: 2, title: "Body Parts", titleAf: "Liggaamsdele", icon: "🦶",
    words: [
      { en: "Head", af: "Kop", emoji: "😊" },
      { en: "Hand", af: "Hand", emoji: "✋" },
      { en: "Foot", af: "Voet", emoji: "🦶" },
      { en: "Eye", af: "Oog", emoji: "👁️" },
      { en: "Ear", af: "Oor", emoji: "👂" },
      { en: "Nose", af: "Neus", emoji: "👃" },
      { en: "Mouth", af: "Mond", emoji: "👄" },
      { en: "Arm", af: "Arm", emoji: "💪" },
    ],
  },
  {
    id: 6, level: 2, title: "Food", titleAf: "Kos", icon: "🍎",
    words: [
      { en: "Bread", af: "Brood", emoji: "🍞" },
      { en: "Water", af: "Water", emoji: "💧" },
      { en: "Milk", af: "Melk", emoji: "🥛" },
      { en: "Apple", af: "Appel", emoji: "🍎" },
      { en: "Egg", af: "Eier", emoji: "🥚" },
      { en: "Rice", af: "Rys", emoji: "🍚" },
      { en: "Meat", af: "Vleis", emoji: "🥩" },
      { en: "Cheese", af: "Kaas", emoji: "🧀" },
    ],
  },
  {
    id: 7, level: 2, title: "Greetings", titleAf: "Groete", icon: "👋",
    words: [
      { en: "Hello", af: "Hallo", emoji: "👋" },
      { en: "Goodbye", af: "Totsiens", emoji: "🫡" },
      { en: "Please", af: "Asseblief", emoji: "🙏" },
      { en: "Thank you", af: "Dankie", emoji: "😊" },
      { en: "Yes", af: "Ja", emoji: "✅" },
      { en: "No", af: "Nee", emoji: "❌" },
      { en: "Sorry", af: "Jammer", emoji: "😔" },
      { en: "Good morning", af: "Goeie môre", emoji: "🌅" },
    ],
  },
  {
    id: 8, level: 3, title: "At School", titleAf: "By die Skool", icon: "🏫",
    words: [
      { en: "Book", af: "Boek", emoji: "📖" },
      { en: "Pen", af: "Pen", emoji: "🖊️" },
      { en: "Teacher", af: "Onderwyser", emoji: "👩‍🏫" },
      { en: "Desk", af: "Lessenaar", emoji: "🪑" },
      { en: "School", af: "Skool", emoji: "🏫" },
      { en: "Homework", af: "Huiswerk", emoji: "📝" },
      { en: "Learn", af: "Leer", emoji: "🧠" },
      { en: "Read", af: "Lees", emoji: "📚" },
    ],
  },
  {
    id: 9, level: 3, title: "Phrases", titleAf: "Frases", icon: "💬",
    words: [
      { en: "How are you?", af: "Hoe gaan dit?", emoji: "🤔" },
      { en: "I am fine", af: "Dit gaan goed", emoji: "😊" },
      { en: "What is your name?", af: "Wat is jou naam?", emoji: "🏷️" },
      { en: "My name is", af: "My naam is", emoji: "👤" },
      { en: "I don't know", af: "Ek weet nie", emoji: "🤷" },
      { en: "I understand", af: "Ek verstaan", emoji: "💡" },
      { en: "Help me please", af: "Help my asseblief", emoji: "🆘" },
      { en: "Where is the", af: "Waar is die", emoji: "📍" },
    ],
  },
  {
    id: 10, level: 3, title: "Weather", titleAf: "Weer", icon: "⛅",
    words: [
      { en: "Sun", af: "Son", emoji: "☀️" },
      { en: "Rain", af: "Reën", emoji: "🌧️" },
      { en: "Wind", af: "Wind", emoji: "💨" },
      { en: "Cold", af: "Koud", emoji: "🥶" },
      { en: "Hot", af: "Warm", emoji: "🥵" },
      { en: "Cloud", af: "Wolk", emoji: "☁️" },
      { en: "Storm", af: "Storm", emoji: "⛈️" },
      { en: "It is raining", af: "Dit reën", emoji: "🌧️" },
    ],
  },
];

export type Direction = "en-af" | "af-en";

export const gameModes = [
  { id: "flashcards", name: "Flashcards", icon: "🃏", description: "Flip cards to learn words" },
  { id: "match", name: "Match Pairs", icon: "🔗", description: "Match words to translations" },
  { id: "listen", name: "Listen & Choose", icon: "🔊", description: "Hear a word and pick it" },
  { id: "spell", name: "Spell It", icon: "✏️", description: "Type the translation" },
] as const;

export type GameId = typeof gameModes[number]["id"];

export function getWord(word: Word, direction: Direction, which: "from" | "to"): string {
  if (direction === "en-af") return which === "from" ? word.en : word.af;
  return which === "from" ? word.af : word.en;
}

export function getLang(direction: Direction, which: "from" | "to"): string {
  if (direction === "en-af") return which === "from" ? "en-ZA" : "af-ZA";
  return which === "from" ? "af-ZA" : "en-ZA";
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
