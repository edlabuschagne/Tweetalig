import { useEffect, useState } from "react";

import { playWord, stopAudio, type AudioLanguage } from "../audio/player";
import GameShell from "../components/GameShell";
import { getWord, type Direction, type Lesson } from "../data/lessons";

interface FlashcardsProps {
  direction: Direction;
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export default function Flashcards({
  direction,
  lesson,
  onComplete,
  onExit,
}: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioError, setAudioError] = useState("");

  const word = lesson.words[index];
  const fromWord = getWord(word, direction, "from");
  const toWord = getWord(word, direction, "to");
  const fromLanguage = direction === "en-af" ? "English" : "Afrikaans";
  const toLanguage = direction === "en-af" ? "Afrikaans" : "English";
  const audioLanguage: AudioLanguage = direction === "en-af" ? "af" : "en";
  const isLastCard = index === lesson.words.length - 1;

  useEffect(() => stopAudio, []);

  async function revealOrReplay() {
    setAudioError("");
    setIsFlipped(true);

    try {
      await playWord(toWord, audioLanguage);
    } catch {
      setAudioError(`Could not play ${toWord}.`);
    }
  }

  function advance() {
    stopAudio();

    if (isLastCard) {
      onComplete(100);
      return;
    }

    setIndex((current) => current + 1);
    setIsFlipped(false);
    setAudioError("");
  }

  function exitRound() {
    stopAudio();
    onExit();
  }

  const lessonLabel =
    direction === "en-af"
      ? `${lesson.title} → ${lesson.titleAf}`
      : `${lesson.titleAf} → ${lesson.title}`;

  return (
    <GameShell
      current={index + 1}
      lessonLabel={lessonLabel}
      onExit={exitRound}
      total={lesson.words.length}
    >
      <section className="py-7 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-800">
          Flashcards
        </p>
        <h1 className="mt-1 text-3xl font-black text-cyan-950">
          {isFlipped ? `${toLanguage} translation` : `${fromLanguage} word`}
        </h1>

        <button
          aria-label={
            isFlipped
              ? `Replay ${toLanguage} audio for ${toWord}`
              : `Flip card showing ${fromLanguage} word ${fromWord}`
          }
          className={`mx-auto mt-6 flex min-h-72 w-full max-w-lg flex-col items-center justify-center rounded-3xl border-4 p-8 shadow-lg transition focus-visible:outline focus-visible:outline-8 focus-visible:outline-offset-4 focus-visible:outline-cyan-900 ${
            isFlipped
              ? "border-amber-400 bg-amber-100"
              : "border-cyan-500 bg-white"
          }`}
          data-testid="flashcard"
          onClick={() => void revealOrReplay()}
          type="button"
        >
          {isFlipped ? (
            <>
              <span aria-hidden="true" className="text-7xl">
                {word.emoji}
              </span>
              <span
                className="mt-5 text-5xl font-black text-amber-950"
                data-testid="flashcard-word"
              >
                {toWord}
              </span>
              <span className="mt-4 font-bold text-amber-800">
                🔊 Tap to hear again
              </span>
            </>
          ) : (
            <>
              <span
                className="text-5xl font-black text-cyan-950"
                data-testid="flashcard-word"
              >
                {fromWord}
              </span>
              <span className="mt-5 font-bold text-cyan-800">
                ↻ Tap or press Enter to flip
              </span>
            </>
          )}
        </button>

        <p className="mt-5 font-semibold text-slate-700" aria-live="polite">
          {isFlipped
            ? `Playing ${toLanguage} audio for ${toWord}.`
            : "The translation and audio appear when you flip."}
        </p>
        {audioError && (
          <p className="mt-2 font-bold text-red-700" role="alert">
            {audioError}
          </p>
        )}

        {isFlipped && (
          <button
            className="mt-6 min-h-12 w-full max-w-lg rounded-2xl bg-cyan-700 px-5 py-3 text-lg font-black text-white shadow focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
            onClick={advance}
            type="button"
          >
            {isLastCard ? "Finish round" : "Next word →"}
          </button>
        )}
      </section>
    </GameShell>
  );
}
