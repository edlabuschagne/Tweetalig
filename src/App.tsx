import { useEffect, useState } from "react";

import {
  audioPath,
  getActiveAudio,
  playWord,
  type AudioLanguage,
} from "./audio/player";
import {
  lessons,
  type Direction,
  type GameId,
  type Lesson,
} from "./data/lessons";
import GamePlay from "./screens/GamePlay";
import GameSelect from "./screens/GameSelect";
import Home from "./screens/Home";
import LessonSelect from "./screens/LessonSelect";
import Results from "./screens/Results";
import { getPlayerName } from "./storage/player-name";
import { getProgress, saveScore, type ProgressMap } from "./storage/progress";

const audioTestLesson = lessons[0];
type Screen = "home" | "lessons" | "games" | "game" | "results";

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

function LearningApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [direction, setDirection] = useState<Direction>("en-af");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameId>("flashcards");
  const [resultScore, setResultScore] = useState(0);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    void getPlayerName()
      .then(setPlayerName)
      .catch(() => setPlayerName(null))
      .finally(() => setIsLoadingName(false));
  }, []);

  useEffect(() => {
    void getProgress()
      .then(setProgress)
      .catch(() => setProgress({}));
  }, []);

  if (isLoadingName) {
    return (
      <main className="min-h-screen bg-sky-50 p-6">
        <h1 className="text-4xl font-bold text-sky-950">Tweetalig</h1>
        <p className="mt-3 text-lg text-slate-700">
          Loading your learning path…
        </p>
      </main>
    );
  }

  if (screen === "lessons") {
    return (
      <LessonSelect
        direction={direction}
        onChangeDirection={setDirection}
        onHome={() => setScreen("home")}
        onSelectLesson={(lesson) => {
          setSelectedLesson(lesson);
          setScreen("games");
        }}
        progress={progress}
      />
    );
  }

  if (screen === "games" && selectedLesson) {
    return (
      <GameSelect
        direction={direction}
        lesson={selectedLesson}
        onBack={() => setScreen("lessons")}
        onSelectGame={(game) => {
          setSelectedGame(game);
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "game" && selectedLesson) {
    return (
      <GamePlay
        direction={direction}
        game={selectedGame}
        lesson={selectedLesson}
        onComplete={(score) => {
          setResultScore(score);
          void saveScore(direction, selectedLesson.id, selectedGame, score)
            .then(setProgress)
            .catch(() => {});
          setScreen("results");
        }}
        onExit={() => setScreen("games")}
      />
    );
  }

  if (screen === "results" && selectedLesson) {
    return (
      <Results
        direction={direction}
        lesson={selectedLesson}
        onChooseLesson={() => setScreen("lessons")}
        onPlayAgain={() => setScreen("game")}
        score={resultScore}
      />
    );
  }

  return (
    <Home
      playerName={playerName}
      onContinue={() => setScreen("lessons")}
      onNameSaved={setPlayerName}
      progress={progress}
    />
  );
}

export default function App() {
  const showAudioTest =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("audio-test");

  return showAudioTest ? <AudioTestScreen /> : <LearningApp />;
}
