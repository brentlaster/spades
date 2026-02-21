export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type PlayerPosition = 'south' | 'west' | 'north' | 'east';

export interface Player {
  position: PlayerPosition;
  name: string;
  hand: Card[];
  bid: number | null;
  tricksWon: number;
  isHuman: boolean;
}

export interface Trick {
  cards: { player: PlayerPosition; card: Card }[];
  leader: PlayerPosition;
  winner?: PlayerPosition;
}

export interface TeamScore {
  totalScore: number;
  bags: number;
  roundScores: { score: number; bags: number; bid: number; tricks: number }[];
}

export type GamePhase = 'idle' | 'dealing' | 'bidding' | 'playing' | 'trickEnd' | 'roundEnd' | 'gameOver';

export interface GameState {
  phase: GamePhase;
  players: Record<PlayerPosition, Player>;
  currentTrick: Trick;
  completedTricks: Trick[];
  scores: {
    northSouth: TeamScore;
    eastWest: TeamScore;
  };
  currentPlayer: PlayerPosition;
  dealer: PlayerPosition;
  spadesBroken: boolean;
  roundNumber: number;
  targetScore: number;
  message: string;
  lastTrickWinner?: PlayerPosition;
}

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '\u2660',
  hearts: '\u2665',
  diamonds: '\u2666',
  clubs: '\u2663',
};

export const SUIT_COLORS: Record<Suit, string> = {
  spades: '#1a1a2e',
  hearts: '#cc0000',
  diamonds: '#cc0000',
  clubs: '#1a1a2e',
};

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

export const POSITION_ORDER: PlayerPosition[] = ['south', 'west', 'north', 'east'];

export function getPartner(pos: PlayerPosition): PlayerPosition {
  const partners: Record<PlayerPosition, PlayerPosition> = {
    south: 'north', north: 'south', east: 'west', west: 'east'
  };
  return partners[pos];
}

export function getNextPlayer(pos: PlayerPosition): PlayerPosition {
  const idx = POSITION_ORDER.indexOf(pos);
  return POSITION_ORDER[(idx + 1) % 4];
}

export function getTeam(pos: PlayerPosition): 'northSouth' | 'eastWest' {
  return pos === 'north' || pos === 'south' ? 'northSouth' : 'eastWest';
}

export function cardToString(card: Card): string {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

export function sameCard(a: Card, b: Card): boolean {
  return a.suit === b.suit && a.rank === b.rank;
}
