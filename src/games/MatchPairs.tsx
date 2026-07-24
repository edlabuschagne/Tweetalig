import { useEffect, useMemo, useRef, useState } from "react";

import GameShell from "../components/GameShell";
import { getWord, shuffle, type Direction, type Lesson } from "../data/lessons";

interface MatchPairsProps {
  direction: Direction;
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

// A child-sized grid: cap at six pairs so the two columns stay tappable.
const maxPairs = 6;

type Side = "from" | "to";
interface Pick {
  side: Side;
  id: number;
}
interface Tile {
  id: number;
  side: Side;
  text: string;
}

function samePick(a: Pick, b: Pick): boolean {
  return a.side === b.side && a.id === b.id;
}

export default function MatchPairs({
  direction,
  lesson,
  onComplete,
  onExit,
}: MatchPairsProps) {
  // Stable pair set for this round: first N words, keyed by index so a "from"
  // tile and its "to" tile share an id. Columns are shuffled independently for
  // display only, so position never leaks the answer.
  const pairs = useMemo(
    () =>
      lesson.words.slice(0, maxPairs).map((word, id) => ({
        id,
        from: getWord(word, direction, "from"),
        to: getWord(word, direction, "to"),
      })),
    [lesson, direction],
  );
  const pairCount = pairs.length;

  const fromTiles = useMemo<Tile[]>(
    // Reshuffle only when the round's pair set changes.
    () => shuffle(pairs.map((p) => ({ id: p.id, side: "from", text: p.from }))),
    [pairs],
  );
  const toTiles = useMemo<Tile[]>(
    () => shuffle(pairs.map((p) => ({ id: p.id, side: "to", text: p.to }))),
    [pairs],
  );

  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [firstPick, setFirstPick] = useState<Pick | null>(null);
  const [wrongPicks, setWrongPicks] = useState<Pick[] | null>(null);
  const [mismatches, setMismatches] = useState(0);
  const completedRef = useRef(false);

  // Route to Results once every pair is locked. Accuracy score: correct picks
  // over total picks, so a flawless round is 100 and each mismatch dilutes it.
  useEffect(() => {
    if (completedRef.current) return;
    if (pairCount > 0 && matched.size === pairCount) {
      completedRef.current = true;
      const score = Math.round((pairCount / (pairCount + mismatches)) * 100);
      onComplete(score);
    }
  }, [matched, mismatches, pairCount, onComplete]);

  function isWrong(side: Side, id: number): boolean {
    return !!wrongPicks?.some((p) => p.side === side && p.id === id);
  }

  function handleTile(side: Side, id: number) {
    if (matched.has(id)) return;

    // Any tap after a mismatch first clears the red state, then counts as the
    // start of a fresh selection (firstPick is already null in that state).
    if (wrongPicks) setWrongPicks(null);

    const pick: Pick = { side, id };

    if (!firstPick) {
      setFirstPick(pick);
      return;
    }
    if (samePick(firstPick, pick)) {
      setFirstPick(null); // tap the selected tile again to deselect
      return;
    }
    if (firstPick.side === side) {
      setFirstPick(pick); // move the highlight within the same column
      return;
    }

    // Opposite columns chosen — evaluate the pair.
    if (firstPick.id === id) {
      setMatched((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setFirstPick(null);
    } else {
      setWrongPicks([firstPick, pick]);
      setFirstPick(null);
      setMismatches((count) => count + 1);
    }
  }

  const lessonLabel =
    direction === "en-af"
      ? `${lesson.title} → ${lesson.titleAf}`
      : `${lesson.titleAf} → ${lesson.title}`;

  let feedback = "Tap a word, then tap its match.";
  if (wrongPicks) feedback = "✗ Not a match — try again.";
  else if (firstPick) feedback = "Now tap its match in the other column.";

  function renderColumn(tiles: Tile[], heading: string, testid: string) {
    return (
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-800">
          {heading}
        </h2>
        <ul className="mt-3 space-y-3">
          {tiles.map((tile) => {
            const isMatched = matched.has(tile.id);
            const isSelected =
              !!firstPick &&
              firstPick.side === tile.side &&
              firstPick.id === tile.id;
            const wrong = isWrong(tile.side, tile.id);

            let state =
              "border-slate-300 bg-white text-slate-900 hover:border-cyan-400";
            if (isMatched) {
              state = "border-emerald-600 bg-emerald-50 text-emerald-900";
            } else if (wrong) {
              state = "border-red-500 bg-red-50 text-red-900";
            } else if (isSelected) {
              state =
                "border-cyan-700 bg-cyan-50 text-cyan-950 ring-2 ring-cyan-500";
            }

            return (
              <li key={`${tile.side}-${tile.id}`}>
                <button
                  aria-pressed={isSelected}
                  className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-lg font-black shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900 disabled:cursor-default ${state}`}
                  data-testid={testid}
                  disabled={isMatched}
                  onClick={() => handleTile(tile.side, tile.id)}
                  type="button"
                >
                  {isMatched && <span aria-hidden="true">✓</span>}
                  {wrong && <span aria-hidden="true">✗</span>}
                  <span>{tile.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <GameShell
      current={matched.size}
      lessonLabel={lessonLabel}
      onExit={onExit}
      total={pairCount}
      unitLabel="Pair"
    >
      <section className="py-7">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-800">
            Match Pairs
          </p>
          <h1 className="mt-1 text-2xl font-black text-cyan-950">
            Match each word to its translation
          </h1>
        </div>

        <p
          aria-live="polite"
          className="mt-4 min-h-6 text-center text-lg font-bold text-cyan-900"
          data-testid="match-feedback"
        >
          {feedback}
        </p>

        <div className="mx-auto mt-6 grid max-w-lg gap-5 sm:grid-cols-2">
          {renderColumn(fromTiles, "Words", "match-from")}
          {renderColumn(toTiles, "Translations", "match-to")}
        </div>
      </section>
    </GameShell>
  );
}
