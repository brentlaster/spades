import type { Card, GameState, PlayerPosition, Trick } from './types';
import { RANK_VALUES, getPartner } from './types';
import { getLegalPlays, getTrickWinner } from './rules';

export type AIDifficulty = 'beginner' | 'intermediate' | 'advanced';

/** AI bidding logic */
export function aiBid(hand: Card[], difficulty: AIDifficulty): number {
  let estimatedTricks = 0;

  // Count high spades
  const spades = hand.filter(c => c.suit === 'spades');
  const nonSpades = hand.filter(c => c.suit !== 'spades');

  // Spade counting
  for (const card of spades) {
    if (card.rank === 'A') estimatedTricks += 1;
    else if (card.rank === 'K') estimatedTricks += 0.9;
    else if (card.rank === 'Q') estimatedTricks += 0.7;
    else if (card.rank === 'J') estimatedTricks += 0.4;
    else if (card.rank === '10') estimatedTricks += 0.2;
  }

  // Long spade bonus
  if (spades.length >= 5) estimatedTricks += 0.5;
  if (spades.length >= 6) estimatedTricks += 1;

  // Count high cards in other suits
  const suitGroups: Record<string, Card[]> = {};
  for (const card of nonSpades) {
    if (!suitGroups[card.suit]) suitGroups[card.suit] = [];
    suitGroups[card.suit].push(card);
  }

  for (const suit of Object.keys(suitGroups)) {
    const cards = suitGroups[suit];
    for (const card of cards) {
      if (card.rank === 'A') estimatedTricks += 0.9;
      else if (card.rank === 'K' && cards.length >= 2) estimatedTricks += 0.7;
      else if (card.rank === 'Q' && cards.length >= 3) estimatedTricks += 0.4;
    }
    // Void or singleton bonus (can trump)
    if (cards.length <= 1 && spades.length >= 2) estimatedTricks += 0.5;
  }

  // Void suits (suits not in hand at all)
  const suitsInHand = new Set(hand.map(c => c.suit));
  const voidSuits = ['hearts', 'diamonds', 'clubs'].filter(s => !suitsInHand.has(s as any));
  for (const _ of voidSuits) {
    if (spades.length >= 1) estimatedTricks += 0.8;
  }

  let bid = Math.round(estimatedTricks);

  // Difficulty adjustments
  if (difficulty === 'beginner') {
    // More random, less accurate
    bid += Math.random() > 0.5 ? 1 : -1;
  } else if (difficulty === 'advanced') {
    // Slightly more conservative
    bid = Math.round(estimatedTricks - 0.2);
  }

  // Clamp bid
  bid = Math.max(1, Math.min(13, bid));

  return bid;
}

/** AI card playing logic */
export function aiPlayCard(
  hand: Card[],
  trick: Trick,
  state: GameState,
  position: PlayerPosition,
  difficulty: AIDifficulty
): Card {
  const legal = getLegalPlays(hand, trick, state.spadesBroken);

  if (legal.length === 1) return legal[0];

  if (difficulty === 'beginner') {
    return beginnerPlay(legal, trick, state, position);
  } else if (difficulty === 'intermediate') {
    return intermediatePlay(legal, hand, trick, state, position);
  } else {
    return advancedPlay(legal, hand, trick, state, position);
  }
}

function beginnerPlay(legal: Card[], trick: Trick, _state: GameState, _position: PlayerPosition): Card {
  // Beginner: mostly random, with basic "play high to win" logic
  if (trick.cards.length === 0) {
    // Lead with a random card
    return legal[Math.floor(Math.random() * legal.length)];
  }

  // Try to win with the lowest winning card
  const leadSuit = trick.cards[0].card.suit;
  const highestInTrick = getHighestRankInTrick(trick, leadSuit);

  const winners = legal.filter(c =>
    c.suit === leadSuit && RANK_VALUES[c.rank] > highestInTrick
  );

  if (winners.length > 0 && Math.random() > 0.3) {
    // Play lowest winner
    return winners.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
  }

  // Play lowest card
  return legal.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
}

function intermediatePlay(
  legal: Card[], hand: Card[], trick: Trick, state: GameState, position: PlayerPosition
): Card {
  const partner = getPartner(position);

  if (trick.cards.length === 0) {
    return chooseLead(legal, hand, state);
  }

  const leadSuit = trick.cards[0].card.suit;

  // Check if partner is currently winning
  if (trick.cards.length >= 2) {
    const currentWinner = getTrickWinner({ ...trick, cards: trick.cards });
    if (currentWinner === partner) {
      // Partner winning - play low
      return playLowest(legal);
    }
  }

  // Try to win
  return tryToWin(legal, trick, leadSuit);
}

function advancedPlay(
  legal: Card[], hand: Card[], trick: Trick, state: GameState, position: PlayerPosition
): Card {
  const partner = getPartner(position);
  const player = state.players[position];
  const partnerPlayer = state.players[partner];
  const teamTricks = player.tricksWon + partnerPlayer.tricksWon;
  const teamBid = (player.bid || 0) + (partnerPlayer.bid || 0);
  const needMore = teamTricks < teamBid;

  if (trick.cards.length === 0) {
    return chooseLeadAdvanced(legal, hand, state, needMore);
  }

  const leadSuit = trick.cards[0].card.suit;

  // Last to play - be precise
  if (trick.cards.length === 3) {
    const currentWinner = getTrickWinner({ ...trick, cards: trick.cards });
    if (currentWinner === partner) {
      // Partner winning - dump lowest
      return playLowest(legal);
    }
    // Need to win - play cheapest winner
    return tryToWinCheaply(legal, trick, leadSuit);
  }

  // Check if partner is winning
  if (trick.cards.length >= 2) {
    const currentWinner = getTrickWinner({ ...trick, cards: trick.cards });
    if (currentWinner === partner) {
      return playLowest(legal);
    }
  }

  if (needMore) {
    return tryToWin(legal, trick, leadSuit);
  } else {
    // Already met bid - avoid bags, play low
    return playLowest(legal);
  }
}

function chooseLead(legal: Card[], _hand: Card[], _state: GameState): Card {
  // Lead with aces of non-spade suits
  const nonSpadeAces = legal.filter(c => c.rank === 'A' && c.suit !== 'spades');
  if (nonSpadeAces.length > 0) return nonSpadeAces[0];

  // Lead with high non-spade
  const nonSpades = legal.filter(c => c.suit !== 'spades');
  if (nonSpades.length > 0) {
    return nonSpades.sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank])[0];
  }

  // Must lead spade
  return legal.sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank])[0];
}

function chooseLeadAdvanced(legal: Card[], hand: Card[], _state: GameState, needMore: boolean): Card {
  if (needMore) {
    // Lead aces to grab tricks
    const aces = legal.filter(c => c.rank === 'A' && c.suit !== 'spades');
    if (aces.length > 0) return aces[0];

    // Lead Kings with protection
    const kings = legal.filter(c => c.rank === 'K' && c.suit !== 'spades');
    for (const king of kings) {
      const suitCards = hand.filter(c => c.suit === king.suit);
      if (suitCards.length >= 2) return king;
    }

    // Lead from short suits to create voids
    const suitCounts: Record<string, number> = {};
    for (const c of hand) {
      suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    }
    const nonSpades = legal.filter(c => c.suit !== 'spades');
    if (nonSpades.length > 0) {
      nonSpades.sort((a, b) => (suitCounts[a.suit] || 0) - (suitCounts[b.suit] || 0));
      return nonSpades[0];
    }
  } else {
    // Don't need tricks - lead low
    const nonSpades = legal.filter(c => c.suit !== 'spades');
    if (nonSpades.length > 0) {
      return nonSpades.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
    }
  }

  return legal.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
}

function tryToWin(legal: Card[], trick: Trick, leadSuit: string): Card {
  const highestInTrick = getHighestRankInTrick(trick, leadSuit);
  const spadesInTrick = trick.cards.some(e => e.card.suit === 'spades');

  // Try to win by following suit
  const followSuit = legal.filter(c => c.suit === leadSuit);
  if (followSuit.length > 0) {
    if (!spadesInTrick || leadSuit === 'spades') {
      const winners = followSuit.filter(c => RANK_VALUES[c.rank] > highestInTrick);
      if (winners.length > 0) {
        return winners.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
      }
    }
    return followSuit.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
  }

  // Can't follow - trump with lowest spade
  const spades = legal.filter(c => c.suit === 'spades');
  if (spades.length > 0) {
    if (spadesInTrick) {
      const highSpade = Math.max(...trick.cards
        .filter(e => e.card.suit === 'spades')
        .map(e => RANK_VALUES[e.card.rank]));
      const overSpades = spades.filter(c => RANK_VALUES[c.rank] > highSpade);
      if (overSpades.length > 0) {
        return overSpades.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
      }
    } else {
      return spades.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
    }
  }

  // Can't win - play lowest
  return playLowest(legal);
}

function tryToWinCheaply(legal: Card[], trick: Trick, leadSuit: string): Card {
  return tryToWin(legal, trick, leadSuit);
}

function playLowest(cards: Card[]): Card {
  // Play lowest non-spade first, then lowest spade
  const nonSpades = cards.filter(c => c.suit !== 'spades');
  if (nonSpades.length > 0) {
    return nonSpades.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
  }
  return cards.sort((a, b) => RANK_VALUES[a.rank] - RANK_VALUES[b.rank])[0];
}

function getHighestRankInTrick(trick: Trick, suit: string): number {
  const suitCards = trick.cards.filter(e => e.card.suit === suit);
  if (suitCards.length === 0) return 0;
  return Math.max(...suitCards.map(e => RANK_VALUES[e.card.rank]));
}
