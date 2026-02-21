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

  // On mobile (60px cards), we have ~390px width. Overlap cards so they all fit.
  // Formula: totalWidth = cardWidth + (count-1) * (cardWidth + overlap)
  // Solve for overlap to fit in container: overlap = (containerWidth - cardWidth) / (count-1) - cardWidth
  // We use negative margins to overlap.
  const cardCount = cards.length;

  return (
    <div className="flex justify-center items-end px-1 md:px-4">
      {cards.map((card, i) => {
        const isLegal = legalPlays.some(c => sameCard(c, card));
        const isSelected = selectedCard && sameCard(selectedCard, card);
        const hint = showHints && gameState && isLegal
          ? getPlayHint(card, cards, trick, gameState)
          : undefined;

        // Mobile: overlap so 13 cards fit in ~370px with 60px cards
        // Desktop: overlap so 13 cards fit comfortably with 80px cards
        const mobileOverlap = cardCount > 1 ? -Math.max(15, (cardCount * 60 - 370) / (cardCount - 1)) : 0;
        const desktopOverlap = cardCount > 1 ? -Math.max(0, (cardCount * 80 - 700) / (cardCount - 1)) : 0;

        return (
          <div
            key={`${card.rank}-${card.suit}`}
            className="animate-deal mobile-card-overlap"
            style={{
              animationDelay: `${i * 0.03}s`,
              marginLeft: i > 0 ? `var(--card-overlap)` : '0',
              '--card-overlap-mobile': `${mobileOverlap}px`,
              '--card-overlap-desktop': `${desktopOverlap}px`,
            } as React.CSSProperties}
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
