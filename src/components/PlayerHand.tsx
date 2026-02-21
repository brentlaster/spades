import type { Card, Trick, GameState } from '../game/types';
import { sameCard } from '../game/types';
import { getLegalPlays } from '../game/rules';
import { getPlayHint } from '../game/rules';
import { CardView, CardBack } from './Card';

interface PlayerHandProps {
  cards: Card[];
  isHuman: boolean;
  isCurrentPlayer: boolean;
  trick: Trick;
  spadesBroken: boolean;
  onPlayCard?: (card: Card) => void;
  selectedCard?: Card | null;
  showHints?: boolean;
  gameState?: GameState;
}

export function PlayerHand({
  cards, isHuman, isCurrentPlayer, trick, spadesBroken,
  onPlayCard, selectedCard, showHints, gameState
}: PlayerHandProps) {
  if (!isHuman) {
    // Show face-down cards for AI players
    return (
      <div className="flex justify-center">
        {cards.map((_, i) => (
          <CardBack
            key={i}
            small
            style={{ marginLeft: i > 0 ? '-20px' : '0' }}
          />
        ))}
      </div>
    );
  }

  const legalPlays = isCurrentPlayer ? getLegalPlays(cards, trick, spadesBroken) : [];

  // Calculate overlap based on card count to fit on screen
  const cardCount = cards.length;
  const overlapPx = cardCount > 8 ? Math.max(-20, -(cardCount - 6) * 4) : 0;

  return (
    <div className="flex justify-center items-end px-1 md:px-4 overflow-x-auto">
      {cards.map((card, i) => {
        const isLegal = legalPlays.some(c => sameCard(c, card));
        const isSelected = selectedCard && sameCard(selectedCard, card);
        const hint = showHints && gameState && isLegal
          ? getPlayHint(card, cards, trick, gameState)
          : undefined;

        return (
          <div
            key={`${card.rank}-${card.suit}`}
            className="animate-deal"
            style={{
              animationDelay: `${i * 0.03}s`,
              marginLeft: i > 0 ? `${overlapPx}px` : '0',
            }}
          >
            <CardView
              card={card}
              onClick={() => isLegal && onPlayCard?.(card)}
              selected={isSelected || false}
              disabled={isCurrentPlayer && !isLegal}
              hint={hint}
            />
          </div>
        );
      })}
    </div>
  );
}
