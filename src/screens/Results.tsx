import type { Direction, Lesson } from "../data/lessons";
import { starFor } from "../storage/progress";

const starLabels: Record<string, string> = {
  "🥉": "Bronze star",
  "🥈": "Silver star",
  "⭐": "Gold star",
};

interface ResultsProps {
  direction: Direction;
  lesson: Lesson;
  onChooseLesson: () => void;
  onPlayAgain: () => void;
  score: number;
}

export default function Results({
  direction,
  lesson,
  onChooseLesson,
  onPlayAgain,
  score,
}: ResultsProps) {
  const lessonLabel =
    direction === "en-af"
      ? `${lesson.title} → ${lesson.titleAf}`
      : `${lesson.titleAf} → ${lesson.title}`;

  const star = starFor(score);
  const starLabel = star ? starLabels[star] : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-100 to-amber-50 px-5 py-10 text-slate-900">
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
          Round complete
        </p>
        <h1 className="mt-2 text-4xl font-black text-emerald-950">
          Great learning!
        </h1>
        <p className="mt-3 text-lg font-bold text-slate-700">{lessonLabel}</p>
        <div
          aria-label={`Score ${score} out of 100`}
          className="mx-auto mt-7 flex h-44 w-44 flex-col items-center justify-center rounded-full border-8 border-emerald-300 bg-emerald-50"
        >
          <span className="text-6xl font-black text-emerald-900">{score}</span>
          <span className="font-bold text-emerald-800">out of 100</span>
        </div>
        {star ? (
          <p
            className="mt-5 text-xl font-black text-emerald-900"
            data-testid="results-star"
          >
            <span aria-hidden="true" className="text-3xl">
              {star}
            </span>{" "}
            {starLabel}!
          </p>
        ) : (
          <p
            className="mt-5 font-bold text-slate-700"
            data-testid="results-star"
          >
            Keep practising — you’ll earn a star next time!
          </p>
        )}
        <p className="mt-3 text-slate-700">
          You finished this round. Great effort!
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            className="min-h-12 rounded-2xl border-2 border-emerald-700 bg-white px-5 py-3 font-bold text-emerald-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
            onClick={onChooseLesson}
            type="button"
          >
            Choose a lesson
          </button>
          <button
            className="min-h-12 rounded-2xl bg-emerald-700 px-5 py-3 font-bold text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
            onClick={onPlayAgain}
            type="button"
          >
            Play again
          </button>
        </div>
      </section>
    </main>
  );
}
