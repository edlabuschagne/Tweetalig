import type { Direction, GameId, Lesson } from "../data/lessons";
import Flashcards from "../games/Flashcards";
import ListenChoose from "../games/ListenChoose";

interface GamePlayProps {
  direction: Direction;
  game: GameId;
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export default function GamePlay({ game, ...props }: GamePlayProps) {
  switch (game) {
    case "listen":
      return <ListenChoose {...props} />;
    case "flashcards":
    default:
      return <Flashcards {...props} />;
  }
}
