import type { Direction, Lesson } from "../data/lessons";
import Flashcards from "../games/Flashcards";

interface GamePlayProps {
  direction: Direction;
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export default function GamePlay(props: GamePlayProps) {
  return <Flashcards {...props} />;
}
