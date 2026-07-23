import { gameModes, type Direction, type Lesson } from "../data/lessons";

interface GameSelectProps {
  direction: Direction;
  lesson: Lesson;
  onBack: () => void;
}

export default function GameSelect({
  direction,
  lesson,
  onBack,
}: GameSelectProps) {
  const lessonLabel =
    direction === "en-af"
      ? `${lesson.title} → ${lesson.titleAf}`
      : `${lesson.titleAf} → ${lesson.title}`;

  return (
    <main className="min-h-screen bg-violet-50 px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <button
          className="min-h-11 rounded-xl px-3 py-2 font-bold text-violet-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-violet-900"
          onClick={onBack}
          type="button"
        >
          ← Lessons
        </button>
        <p className="mt-4 text-lg font-bold text-violet-800">{lessonLabel}</p>
        <h1 className="mt-1 text-4xl font-black text-violet-950">
          Choose a game
        </h1>
        <p className="mt-2 text-slate-700">
          These game adventures unlock in the next milestones.
        </p>

        <div
          aria-label="Available game types"
          className="mt-7 grid gap-4 sm:grid-cols-2"
        >
          {gameModes.map((game) => (
            <article
              className="min-h-36 rounded-2xl border-2 border-violet-200 bg-white p-5 shadow-sm"
              data-testid="game-tile"
              key={game.id}
            >
              <span aria-hidden="true" className="text-4xl">
                {game.icon}
              </span>
              <h2 className="mt-3 text-xl font-black">{game.name}</h2>
              <p className="mt-1 text-slate-600">{game.description}</p>
              <p className="mt-3 text-sm font-bold text-violet-700">
                Coming next
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
