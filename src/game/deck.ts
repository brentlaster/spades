import type { Card } from './types';
import { SUITS, RANKS } from './types';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function deal(deck: Card[]): [Card[], Card[], Card[], Card[]] {
  const shuffled = shuffle(deck);
  return [
    sortHand(shuffled.slice(0, 13)),
    sortHand(shuffled.slice(13, 26)),
    sortHand(shuffled.slice(26, 39)),
    sortHand(shuffled.slice(39, 52)),
  ];
}

export function sortHand(hand: Card[]): Card[] {
  const suitOrder = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 };
  const rankOrder: Record<string, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10,
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2,
  };
  return [...hand].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return rankOrder[b.rank] - rankOrder[a.rank];
  });
}
