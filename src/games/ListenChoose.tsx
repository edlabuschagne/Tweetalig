import { useEffect, useMemo, useRef, useState } from "react";

import { playWord, stopAudio, type AudioLanguage } from "../audio/player";
import GameShell from "../components/GameShell";
import {
  getWord,
  shuffle,
  type Direction,
  type Lesson,
  type Word,
} from "../data/lessons";

interface ListenChooseProps {
  direction: Direction;
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const choiceCount = 4;

function buildChoices(
  lesson: Lesson,
  word: Word,
  direction: Direction,
): string[] {
  const answer = getWord(word, direction, "to");
  const distractors = shuffle(
    lesson.words
      .filter((candidate) => candidate !== word)
      .map((candidate) => getWord(candidate, direction, "to"))
      .filter((value) => value !== answer),
  ).slice(0, choiceCount - 1);

  return shuffle([answer, ...distractors]);
}

export default function ListenChoose({
  direction,
  lesson,
  onComplete,
  onExit,
}: ListenChooseProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [audioError, setAudioError] = useState("");
  const hearButtonRef = useRef<HTMLButtonElement>(null);

  const word = lesson.words[index];
  const prompt = getWord(word, direction, "from");
  const answer = getWord(word, direction, "to");
  const audioLanguage: AudioLanguage = direction === "en-af" ? "af" : "en";
  const isLastQuestion = index === lesson.words.length - 1;
  const answered = selected !== null;
  const isCorrect = selected === answer;

  const choices = useMemo(
    () => buildChoices(lesson, word, direction),
    // Rebuild only when the question changes, so choices stay stable mid-question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson, index, direction],
  );

  useEffect(() => stopAudio, []);

  // Focus the "Hear the word" control when a new question appears so the child
  // can play the audio with a single tap. Audio is never auto-played without a
  // gesture (browser autoplay policy + keeps the console clean).
  useEffect(() => {
    hearButtonRef.current?.focus();
  }, [index]);

  async function hearWord() {
    setAudioError("");
    try {
      await playWord(answer, audioLanguage);
    } catch {
      setAudioError("Could not play the word. Tap to try again.");
    }
  }

  function choose(choice: string) {
    if (answered) return;
    setSelected(choice);
    if (choice === answer) setCorrectCount((count) => count + 1);
  }

  function advance() {
    stopAudio();
    if (isLastQuestion) {
      const total = lesson.words.length;
      const finalCorrect = correctCount;
      onComplete(Math.round((finalCorrect / total) * 100));
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
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
      unitLabel="Question"
    >
      <section className="py-7 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-800">
          Listen &amp; Choose
        </p>
        <h1 className="mt-1 text-2xl font-black text-cyan-950">
          Which word means <span data-testid="listen-prompt">“{prompt}”</span>?
        </h1>

        <button
          className="mx-auto mt-6 flex min-h-16 items-center gap-3 rounded-2xl border-4 border-cyan-500 bg-white px-6 py-4 text-xl font-black text-cyan-900 shadow focus-visible:outline focus-visible:outline-8 focus-visible:outline-offset-4 focus-visible:outline-cyan-900"
          onClick={() => void hearWord()}
          ref={hearButtonRef}
          type="button"
        >
          <span aria-hidden="true">🔊</span> Hear the word
        </button>

        {audioError && (
          <p className="mt-3 font-bold text-red-700" role="alert">
            {audioError}
          </p>
        )}

        <div
          aria-label="Answer choices"
          className="mx-auto mt-7 grid max-w-lg gap-3 sm:grid-cols-2"
        >
          {choices.map((choice) => {
            const isAnswerChoice = choice === answer;
            const isChosen = choice === selected;
            let state = "border-slate-300 bg-white text-slate-900";
            if (answered && isAnswerChoice) {
              state = "border-emerald-600 bg-emerald-50 text-emerald-900";
            } else if (answered && isChosen && !isAnswerChoice) {
              state = "border-red-500 bg-red-50 text-red-900";
            }

            return (
              <button
                className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-lg font-black shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900 disabled:cursor-default ${state}`}
                data-testid="listen-choice"
                disabled={answered}
                key={choice}
                onClick={() => choose(choice)}
                type="button"
              >
                {answered && isAnswerChoice && (
                  <span aria-hidden="true">✓ </span>
                )}
                {answered && isChosen && !isAnswerChoice && (
                  <span aria-hidden="true">✗ </span>
                )}
                {choice}
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-6 min-h-6 text-lg font-bold"
          data-testid="listen-feedback"
        >
          {answered &&
            (isCorrect ? (
              <span className="text-emerald-700">✓ Correct! Well done.</span>
            ) : (
              <span className="text-red-700">
                ✗ Not quite — the answer is “{answer}”.
              </span>
            ))}
        </p>

        {answered && (
          <button
            className="mt-4 min-h-12 w-full max-w-lg rounded-2xl bg-cyan-700 px-5 py-3 text-lg font-black text-white shadow focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
            onClick={advance}
            type="button"
          >
            {isLastQuestion ? "Finish round" : "Next word →"}
          </button>
        )}
      </section>
    </GameShell>
  );
}
