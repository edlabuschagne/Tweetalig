import type { ReactNode } from "react";

interface GameShellProps {
  children: ReactNode;
  current: number;
  lessonLabel: string;
  onExit: () => void;
  total: number;
  unitLabel?: string;
}

export default function GameShell({
  children,
  current,
  lessonLabel,
  onExit,
  total,
  unitLabel = "Card",
}: GameShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-100 to-amber-50 px-5 py-6 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <header className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <button
              className="min-h-11 rounded-xl px-3 py-2 font-bold text-cyan-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
              onClick={onExit}
              type="button"
            >
              ← Exit
            </button>
            <p className="text-right font-bold text-cyan-950">{lessonLabel}</p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <progress
              aria-label={`Round progress: ${unitLabel.toLowerCase()} ${current} of ${total}`}
              className="h-3 flex-1 accent-cyan-700"
              max={total}
              value={current}
            />
            <p className="whitespace-nowrap text-sm font-bold">
              {unitLabel} {current} of {total}
            </p>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
