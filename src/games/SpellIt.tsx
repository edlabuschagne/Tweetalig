import { useEffect, useRef, useState } from "react";

import { playWord, stopAudio, type AudioLanguage } from "../audio/player";
import GameShell from "../components/GameShell";
import { getWord, type Direction, type Lesson } from "../data/lessons";
import { isSpellingCorrect } from "./spell-check";

interface SpellItProps {
  direction: Direction;
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

// Cap the typed answer so the input can't be flooded (Check 5 input guard).
const maxAnswerLength = 40;

export default function SpellIt({
  direction,
  lesson,
  onComplete,
  onExit,
}: SpellItProps) {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [audioError, setAudioError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const word = lesson.words[index];
  const prompt = getWord(word, direction, "from");
  const answer = getWord(word, direction, "to");
  const audioLanguage: AudioLanguage = direction === "en-af" ? "af" : "en";
  const isLastQuestion = index === lesson.words.length - 1;
  const isCorrect = checked && isSpellingCorrect(guess, answer);

  useEffect(() => stopAudio, []);

  // Focus the input for each new question so the child can type straight away.
  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  async function hearWord() {
    setAudioError("");
    try {
      await playWord(answer, audioLanguage);
    } catch {
      setAudioError("Could not play the word. Tap to try again.");
    }
  }

  function check() {
    if (checked) return;
    if (guess.trim().length === 0) return; // ignore an empty submit
    setChecked(true);
    if (isSpellingCorrect(guess, answer)) {
      setCorrectCount((count) => count + 1);
    }
  }

  function advance() {
    stopAudio();
    if (isLastQuestion) {
      onComplete(Math.round((correctCount / lesson.words.length) * 100));
      return;
    }
    setIndex((current) => current + 1);
    setGuess("");
    setChecked(false);
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
      unitLabel="Word"
    >
      <section className="py-7 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-800">
          Spell It
        </p>
        <h1 className="mt-1 text-2xl font-black text-cyan-950">
          How do you spell <span data-testid="spell-prompt">“{prompt}”</span>?
        </h1>

        <button
          className="mx-auto mt-5 flex min-h-12 items-center gap-2 rounded-2xl border-2 border-cyan-500 bg-white px-5 py-3 text-lg font-black text-cyan-900 shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
          onClick={() => void hearWord()}
          type="button"
        >
          <span aria-hidden="true">🔊</span> Hear the word
        </button>

        {audioError && (
          <p className="mt-3 font-bold text-red-700" role="alert">
            {audioError}
          </p>
        )}

        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (checked) advance();
            else check();
          }}
        >
          <label
            className="text-left font-bold text-cyan-950"
            htmlFor="spell-answer"
          >
            Type the translation
          </label>
          <input
            aria-describedby="spell-feedback"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="min-h-14 rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-xl font-bold text-slate-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900 disabled:bg-slate-100"
            data-testid="spell-input"
            disabled={checked}
            id="spell-answer"
            maxLength={maxAnswerLength}
            onChange={(event) => setGuess(event.target.value)}
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={guess}
          />

          {!checked ? (
            <button
              className="min-h-12 rounded-2xl bg-cyan-700 px-5 py-3 text-lg font-black text-white shadow focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900 disabled:opacity-50"
              disabled={guess.trim().length === 0}
              type="submit"
            >
              Check
            </button>
          ) : (
            <button
              className="min-h-12 rounded-2xl bg-cyan-700 px-5 py-3 text-lg font-black text-white shadow focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
              type="submit"
            >
              {isLastQuestion ? "Finish round" : "Next word →"}
            </button>
          )}
        </form>

        <p
          aria-live="polite"
          className="mt-6 min-h-6 text-lg font-bold"
          data-testid="spell-feedback"
          id="spell-feedback"
        >
          {checked &&
            (isCorrect ? (
              <span className="text-emerald-700">✓ Correct! Well done.</span>
            ) : (
              <span className="text-red-700">
                ✗ Not quite — it’s spelled “{answer}”.
              </span>
            ))}
        </p>
      </section>
    </GameShell>
  );
}
