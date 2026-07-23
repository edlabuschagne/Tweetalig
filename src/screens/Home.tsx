import { useState, type FormEvent } from "react";

import {
  playerNameMaxLength,
  savePlayerName,
  validatePlayerName,
} from "../storage/player-name";

interface HomeProps {
  playerName: string | null;
  onContinue: () => void;
  onNameSaved: (name: string) => void;
}

export default function Home({
  playerName,
  onContinue,
  onNameSaved,
}: HomeProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validatePlayerName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const savedName = await savePlayerName(name);
      onNameSaved(savedName);
      onContinue();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We could not save that name. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-amber-50 px-5 py-10 text-slate-900">
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-7 shadow-lg">
        <p className="text-sm font-bold uppercase tracking-widest text-sky-700">
          English + Afrikaans
        </p>
        <h1 className="mt-2 text-5xl font-black text-sky-950">Tweetalig</h1>
        <p className="mt-3 text-lg text-slate-700">
          Learn new words, one little step at a time.
        </p>

        {playerName ? (
          <div className="mt-8">
            <h2 className="text-3xl font-bold">Welcome back, {playerName}!</h2>
            <section
              aria-label="Progress summary"
              className="mt-5 rounded-2xl border-2 border-sky-200 bg-sky-50 p-5"
            >
              <p className="font-bold text-sky-950">Your learning path</p>
              <p className="mt-1 text-slate-700">
                🔓 Level 1 ready · 10 lessons to explore
              </p>
            </section>
            <button
              className="mt-6 min-h-12 w-full rounded-2xl bg-sky-700 px-5 py-3 text-lg font-bold text-white shadow focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
              onClick={onContinue}
              type="button"
            >
              Continue learning
            </button>
          </div>
        ) : (
          <form className="mt-8" onSubmit={(event) => void handleSubmit(event)}>
            <label className="block text-lg font-bold" htmlFor="player-name">
              What is your first name?
            </label>
            <input
              aria-describedby={error ? "name-error" : "name-help"}
              aria-invalid={Boolean(error)}
              autoComplete="given-name"
              className="mt-3 min-h-12 w-full rounded-2xl border-2 border-slate-300 px-4 py-3 text-lg focus-visible:border-sky-700 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
              id="player-name"
              maxLength={playerNameMaxLength}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError("");
              }}
              value={name}
            />
            <p className="mt-2 text-sm text-slate-600" id="name-help">
              Saved only on this device.
            </p>
            {error && (
              <p
                className="mt-2 font-semibold text-red-700"
                id="name-error"
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              className="mt-6 min-h-12 w-full rounded-2xl bg-sky-700 px-5 py-3 text-lg font-bold text-white shadow focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-900 disabled:cursor-wait disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving…" : "Start learning"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
