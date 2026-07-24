import type { Direction, GameId, Lesson } from "../data/lessons";
import Flashcards from "../games/Flashcards";
import ListenChoose from "../games/ListenChoose";
import MatchPairs from "../games/MatchPairs";
import SpellIt from "../games/SpellIt";

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
    case "match":
      return <MatchPairs {...props} />;
    case "spell":
      return <SpellIt {...props} />;
    case "flashcards":
    default:
      return <Flashcards {...props} />;
  }
}
