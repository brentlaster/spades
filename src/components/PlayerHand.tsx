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
    return (
      <div className="flex justify-center">
        {cards.map((_, i) => (
          <CardBack
            key={i}
            small
            style={{ marginLeft: i > 0 ? '-28px' : '0' }}
          />
        ))}
      </div>
    );
  }

  const legalPlays = isCurrentPlayer ? getLegalPlays(cards, trick, spadesBroken) : [];

  // Split cards into two rows for mobile: spades+clubs on top, hearts+diamonds on bottom
  // Cards are already sorted by suit (spades, hearts, diamonds, clubs) so regroup them
  const topRow = cards.filter(c => c.suit === 'spades' || c.suit === 'clubs');
  const bottomRow = cards.filter(c => c.suit === 'hearts' || c.suit === 'diamonds');

  function renderCard(card: Card, i: number, rowLength: number) {
    const isLegal = legalPlays.some(c => sameCard(c, card));
    const isSelected = selectedCard && sameCard(selectedCard, card);
    const hint = showHints && gameState && isLegal
      ? getPlayHint(card, cards, trick, gameState)
      : undefined;

    // Mobile: overlap within each row
    const mobileOverlap = rowLength > 1 ? -Math.max(8, (rowLength * 72 - 370) / (rowLength - 1)) : 0;
    // Desktop: single row, overlap based on full hand
    const desktopOverlap = cards.length > 1 ? -Math.max(0, (cards.length * 80 - 700) / (cards.length - 1)) : 0;

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
  }

  return (
    <>
      {/* Mobile: two rows */}
      <div className="md:hidden flex flex-col items-center gap-0.5 px-1">
        {topRow.length > 0 && (
          <div className="flex justify-center items-end">
            {topRow.map((card, i) => renderCard(card, i, topRow.length))}
          </div>
        )}
        {bottomRow.length > 0 && (
          <div className="flex justify-center items-end">
            {bottomRow.map((card, i) => renderCard(card, i, bottomRow.length))}
          </div>
        )}
      </div>

      {/* Desktop: single row */}
      <div className="hidden md:flex justify-center items-end px-4">
        {cards.map((card, i) => renderCard(card, i, cards.length))}
      </div>
    </>
  );
}
