import type { Card, GameState, PlayerPosition, Trick } from './types';
import { RANK_VALUES, sameCard } from './types';

/** Get cards that are legal to play given the current trick and hand */
export function getLegalPlays(hand: Card[], trick: Trick, spadesBroken: boolean): Card[] {
  // If leading
  if (trick.cards.length === 0) {
    // Can play anything if spades are broken or hand is all spades
    if (spadesBroken || hand.every(c => c.suit === 'spades')) {
      return hand;
    }
    // Otherwise, can't lead with spades
    return hand.filter(c => c.suit !== 'spades');
  }

  // Must follow suit
  const leadSuit = trick.cards[0].card.suit;
  const sameSuit = hand.filter(c => c.suit === leadSuit);
  if (sameSuit.length > 0) {
    return sameSuit;
  }

  // Can't follow suit - play anything
  return hand;
}

/** Determine the winner of a completed trick */
export function getTrickWinner(trick: Trick): PlayerPosition {
  const leadSuit = trick.cards[0].card.suit;
  let winningEntry = trick.cards[0];

  for (let i = 1; i < trick.cards.length; i++) {
    const entry = trick.cards[i];
    const current = winningEntry.card;
    const challenger = entry.card;

    if (challenger.suit === 'spades' && current.suit !== 'spades') {
      // Spade trumps non-spade
      winningEntry = entry;
    } else if (challenger.suit === current.suit) {
      // Same suit - higher rank wins
      if (RANK_VALUES[challenger.rank] > RANK_VALUES[current.rank]) {
        winningEntry = entry;
      }
    }
    // Otherwise the current winner stands (off-suit non-spade loses)
  }

  return winningEntry.player;
}

/** Check if a card play is legal */
export function isLegalPlay(card: Card, hand: Card[], trick: Trick, spadesBroken: boolean): boolean {
  const legal = getLegalPlays(hand, trick, spadesBroken);
  return legal.some(c => sameCard(c, card));
}

/** Calculate score for a team after a round */
export function calculateRoundScore(
  bid1: number, tricks1: number,
  bid2: number, tricks2: number
): { score: number; bags: number } {
  const totalBid = bid1 + bid2;
  const totalTricks = tricks1 + tricks2;

  // Nil bid handling would go per-player, but for simplicity combined here
  if (totalBid === 0) {
    // Both bid nil - not standard but handle it
    return totalTricks === 0
      ? { score: 200, bags: 0 }
      : { score: -200, bags: 0 };
  }

  if (totalTricks >= totalBid) {
    const bags = totalTricks - totalBid;
    return { score: totalBid * 10 + bags, bags };
  } else {
    return { score: -totalBid * 10, bags: 0 };
  }
}

/** Calculate score handling nil bids properly */
export function calculateTeamRoundScore(
  player1Bid: number, player1Tricks: number,
  player2Bid: number, player2Tricks: number
): { score: number; bags: number; bid: number; tricks: number } {
  let score = 0;
  let bags = 0;
  const totalBid = player1Bid + player2Bid;
  const totalTricks = player1Tricks + player2Tricks;

  // Handle nil bids individually
  if (player1Bid === 0) {
    score += player1Tricks === 0 ? 100 : -100;
  }
  if (player2Bid === 0) {
    score += player2Tricks === 0 ? 100 : -100;
  }

  // Calculate non-nil combined bid
  const nonNilBid = (player1Bid === 0 ? 0 : player1Bid) + (player2Bid === 0 ? 0 : player2Bid);
  const nonNilTricks = (player1Bid === 0 ? 0 : player1Tricks) + (player2Bid === 0 ? 0 : player2Tricks);

  if (nonNilBid > 0) {
    if (nonNilTricks >= nonNilBid) {
      bags = nonNilTricks - nonNilBid;
      score += nonNilBid * 10 + bags;
    } else {
      score += -nonNilBid * 10;
    }
  }

  return { score, bags, bid: totalBid, tricks: totalTricks };
}

/** Check if game is over */
export function isGameOver(state: GameState): boolean {
  return state.scores.northSouth.totalScore >= state.targetScore ||
    state.scores.eastWest.totalScore >= state.targetScore ||
    state.scores.northSouth.totalScore <= -200 ||
    state.scores.eastWest.totalScore <= -200;
}

/** Get explanation of why a play is good/bad */
export function getPlayHint(card: Card, hand: Card[], trick: Trick, state: GameState): string {
  const legal = getLegalPlays(hand, trick, state.spadesBroken);
  if (!legal.some(c => sameCard(c, card))) {
    return "You can't play this card right now.";
  }

  if (trick.cards.length === 0) {
    // Leading
    if (card.suit === 'spades') {
      return "Leading with a spade (trump) - good if you want to pull out opponents' spades.";
    }
    if (RANK_VALUES[card.rank] >= 12) {
      return "Leading with a high card - likely to win the trick if opponents must follow suit.";
    }
    return "Leading with a low card - a safe play to test what opponents have.";
  }

  const leadSuit = trick.cards[0].card.suit;
  if (card.suit === leadSuit) {
    // Following suit
    const highestInTrick = Math.max(...trick.cards
      .filter(e => e.card.suit === leadSuit)
      .map(e => RANK_VALUES[e.card.rank]));
    if (RANK_VALUES[card.rank] > highestInTrick) {
      return "This card beats the current highest - you'd take the lead!";
    }
    return "This card won't beat the current winner - you'd be throwing off.";
  }

  if (card.suit === 'spades') {
    const spadesInTrick = trick.cards.filter(e => e.card.suit === 'spades');
    if (spadesInTrick.length === 0) {
      return "Trumping with a spade! This will win unless someone plays a higher spade.";
    }
    const highestSpade = Math.max(...spadesInTrick.map(e => RANK_VALUES[e.card.rank]));
    if (RANK_VALUES[card.rank] > highestSpade) {
      return "Over-trumping with a higher spade - nice play!";
    }
    return "This spade won't beat the existing spade in the trick.";
  }

  return "Throwing off-suit - you can't win this trick.";
}
