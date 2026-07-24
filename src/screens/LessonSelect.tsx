import {
  gameModes,
  lessons,
  type Direction,
  type GameId,
  type Lesson,
} from "../data/lessons";
import { isLevelUnlocked, type ProgressMap } from "../storage/progress";

interface LessonSelectProps {
  direction: Direction;
  onChangeDirection: (direction: Direction) => void;
  onHome: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  progress: ProgressMap;
}

const levels = [1, 2, 3] as const;
const gameIds: GameId[] = gameModes.map((mode) => mode.id);

export default function LessonSelect({
  direction,
  onChangeDirection,
  onHome,
  onSelectLesson,
  progress,
}: LessonSelectProps) {
  return (
    <main className="min-h-screen bg-amber-50 px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <button
          className="min-h-11 rounded-xl px-3 py-2 font-bold text-sky-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
          onClick={onHome}
          type="button"
        >
          ← Home
        </button>
        <h1 className="mt-3 text-4xl font-black text-sky-950">
          Choose a lesson
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          Pick where your word adventure begins.
        </p>

        <fieldset className="mt-6">
          <legend className="text-lg font-bold">Learning direction</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              aria-pressed={direction === "en-af"}
              className={`min-h-12 rounded-2xl border-2 px-4 py-3 font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-900 ${
                direction === "en-af"
                  ? "border-sky-700 bg-sky-700 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
              onClick={() => onChangeDirection("en-af")}
              type="button"
            >
              English → Afrikaans
            </button>
            <button
              aria-pressed={direction === "af-en"}
              className={`min-h-12 rounded-2xl border-2 px-4 py-3 font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-900 ${
                direction === "af-en"
                  ? "border-sky-700 bg-sky-700 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
              onClick={() => onChangeDirection("af-en")}
              type="button"
            >
              Afrikaans → English
            </button>
          </div>
        </fieldset>

        <p
          className="mt-5 font-bold text-sky-950"
          data-testid="direction-label"
        >
          Learning:{" "}
          {direction === "en-af"
            ? "English → Afrikaans"
            : "Afrikaans → English"}
        </p>

        <div className="mt-7 space-y-8">
          {levels.map((level) => {
            const isUnlocked = isLevelUnlocked(
              progress,
              direction,
              level,
              lessons,
              gameIds,
            );
            const levelLessons = lessons.filter(
              (lesson) => lesson.level === level,
            );

            return (
              <section aria-labelledby={`level-${level}`} key={level}>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black" id={`level-${level}`}>
                    Level {level}
                  </h2>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold shadow-sm">
                    {isUnlocked ? "🔓 Open" : "🔒 Locked"}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {levelLessons.map((lesson) => {
                    const fromTitle =
                      direction === "en-af" ? lesson.title : lesson.titleAf;
                    const toTitle =
                      direction === "en-af" ? lesson.titleAf : lesson.title;

                    return (
                      <button
                        aria-label={`${fromTitle} to ${toTitle}${isUnlocked ? "" : ", locked"}`}
                        className="min-h-28 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                        data-testid="lesson-card"
                        disabled={!isUnlocked}
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        type="button"
                      >
                        <span aria-hidden="true" className="text-3xl">
                          {lesson.icon}
                        </span>
                        <span className="mt-2 block text-lg font-black">
                          {fromTitle} → {toTitle}
                        </span>
                        {!isUnlocked && (
                          <span className="mt-1 block text-sm font-bold">
                            🔒 Locked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
