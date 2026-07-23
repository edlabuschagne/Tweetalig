import { useEffect, useState } from "react";

import {
  audioPath,
  getActiveAudio,
  playWord,
  type AudioLanguage,
} from "./audio/player";
import { lessons } from "./data/lessons";

const audioTestLesson = lessons[0];

function PlaceholderHome() {
  return (
    <main>
      <h1 className="text-4xl font-bold">Tweetalig</h1>
    </main>
  );
}

function AudioTestScreen() {
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  useEffect(() => {
    const firstWord = audioTestLesson.words[0];
    const preload = new Audio(audioPath(firstWord.en, "en"));
    preload.preload = "auto";
    preload.load();

    return () => {
      preload.pause();
      preload.removeAttribute("src");
      preload.load();
    };
  }, []);

  async function handlePlay(text: string, language: AudioLanguage) {
    setError("");

    try {
      const audio = await playWord(text, language);
      if (getActiveAudio() === audio) {
        setStatus(
          `Playing ${language === "en" ? "English" : "Afrikaans"}: ${text}`,
        );
      }
    } catch {
      setError(`Could not play ${text}.`);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-4xl font-bold">Tweetalig</h1>
      <h2 className="mt-4 text-2xl font-semibold">
        Audio test: {audioTestLesson.title}
      </h2>
      <p className="mt-2" aria-live="polite" data-testid="audio-status">
        {status}
      </p>
      {error && (
        <p className="mt-2 text-red-700" role="alert">
          {error}
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {audioTestLesson.words.map((word) => (
          <li className="rounded border p-3" key={word.en}>
            <p>
              {word.en} / {word.af}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="min-h-11 rounded bg-blue-700 px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={() => void handlePlay(word.en, "en")}
                type="button"
              >
                Play English {word.en}
              </button>
              <button
                className="min-h-11 rounded bg-green-700 px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={() => void handlePlay(word.af, "af")}
                type="button"
              >
                Play Afrikaans {word.af}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function App() {
  return import.meta.env.DEV ? <AudioTestScreen /> : <PlaceholderHome />;
}
