import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, Card, PlayerPosition, Trick } from '../game/types';
import { POSITION_ORDER, getNextPlayer, sameCard } from '../game/types';
import { createDeck, deal } from '../game/deck';
import { getLegalPlays, getTrickWinner, calculateTeamRoundScore } from '../game/rules';
import type { AIDifficulty } from '../game/ai';
import { aiBid, aiPlayCard } from '../game/ai';

function getClientCoachAdvice(phase: string, hand: Card[], bid: number | null, tricksWon: number, trickCards: number): string {
  if (phase === 'bidding') {
    const aces = hand.filter(c => c.rank === 'A').length;
    const kings = hand.filter(c => c.rank === 'K').length;
    const spades = hand.filter(c => c.suit === 'spades').length;

    if (aces >= 3) return `You have ${aces} Aces — that's a strong hand! Consider bidding at least ${aces}.`;
    if (spades >= 5) return `With ${spades} spades, you have great trump power. Bid aggressively on those trumps.`;
    if (kings >= 2 && aces >= 1) return `With ${aces} Ace(s) and ${kings} Kings, you have a solid hand. Bid around ${aces + Math.floor(kings / 2)}.`;
    if (aces === 0 && kings <= 1) return 'Your hand is weak on high cards. Consider a conservative bid of 1 or 2.';
    if (spades === 0) return 'You have no spades to trump with — bid carefully and rely on your high off-suit cards.';
    return `You have ${aces} Ace(s) and ${spades} spade(s). Count your sure tricks and bid accordingly.`;
  }

  const cardsLeft = hand.length;
  const currentBid = bid ?? 0;

  if (tricksWon >= currentBid && currentBid > 0) {
    return `You've already made your bid of ${currentBid}! Play low cards to avoid collecting bags.`;
  }
  if (currentBid > 0 && currentBid - tricksWon > cardsLeft) {
    return `You need ${currentBid - tricksWon} more tricks with only ${cardsLeft} cards left. Play your strongest cards.`;
  }
  if (currentBid > 0 && tricksWon < currentBid && currentBid - tricksWon === cardsLeft) {
    return 'You need to win every remaining trick to make your bid. Lead with your strongest cards!';
  }
  if (trickCards === 0) {
    const aces = hand.filter(c => c.rank === 'A').length;
    if (aces > 0) return "You're leading — consider playing an Ace to guarantee this trick.";
    return "You're leading the trick. Try a card from your longest suit to draw out high cards.";
  }
  if (trickCards === 3) {
    return "You're playing last — you can see all the cards. Win it cheaply or dump a low card.";
  }
  if (currentBid > 0 && tricksWon === currentBid - 1) {
    return `Just ${currentBid - tricksWon} more trick to make your bid. Choose carefully!`;
  }

  const tips = [
    'If your partner is winning the trick, play your lowest card to save your high ones.',
    'Try to lead with your Aces early to guarantee those tricks.',
    'Watch what suits the opponents are out of — they might trump your winners!',
    'Keep track of how many spades have been played.',
    "If you're short in a suit, that's a chance to trump when it's led.",
    'Save at least one high spade for late in the round when it counts most.',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

const PLAYER_NAMES: Record<PlayerPosition, string> = {
  south: 'You',
  west: 'Maya',
  north: 'Alex',
  east: 'Jordan',
};

function createInitialState(): GameState {
  return {
    phase: 'idle',
    players: {
      south: { position: 'south', name: PLAYER_NAMES.south, hand: [], bid: null, tricksWon: 0, isHuman: true },
      west: { position: 'west', name: PLAYER_NAMES.west, hand: [], bid: null, tricksWon: 0, isHuman: false },
      north: { position: 'north', name: PLAYER_NAMES.north, hand: [], bid: null, tricksWon: 0, isHuman: false },
      east: { position: 'east', name: PLAYER_NAMES.east, hand: [], bid: null, tricksWon: 0, isHuman: false },
    },
    currentTrick: { cards: [], leader: 'south' },
    completedTricks: [],
    scores: {
      northSouth: { totalScore: 0, bags: 0, roundScores: [] },
      eastWest: { totalScore: 0, bags: 0, roundScores: [] },
    },
    currentPlayer: 'south',
    dealer: 'south',
    spadesBroken: false,
    roundNumber: 0,
    targetScore: 500,
    message: '',
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('intermediate');
  const [showHints, setShowHints] = useState(true);
  const [coachMessage, setCoachMessage] = useState<string>('');
  const aiTimerRef = useRef<number | null>(null);

  // Start a new game
  const startGame = useCallback(() => {
    const dealer: PlayerPosition = 'south';
    const firstBidder = getNextPlayer(dealer);
    const deck = createDeck();
    const [south, west, north, east] = deal(deck);

    setState(prev => ({
      ...createInitialState(),
      phase: 'bidding',
      players: {
        south: { ...prev.players.south, hand: south, bid: null, tricksWon: 0 },
        west: { ...prev.players.west, hand: west, bid: null, tricksWon: 0 },
        north: { ...prev.players.north, hand: north, bid: null, tricksWon: 0 },
        east: { ...prev.players.east, hand: east, bid: null, tricksWon: 0 },
      },
      currentPlayer: firstBidder,
      dealer,
      roundNumber: 1,
      currentTrick: { cards: [], leader: firstBidder },
      message: 'Bidding has begun!',
    }));
    setCoachMessage('Welcome! Look at your hand and count your likely tricks. Aces and Kings are strong. Spades are trump and beat all other suits!');
  }, []);

  // Start a new round (keep scores)
  const startNewRound = useCallback(() => {
    setState(prev => {
      const newDealer = getNextPlayer(prev.dealer);
      const firstBidder = getNextPlayer(newDealer);
      const deck = createDeck();
      const [south, west, north, east] = deal(deck);

      return {
        ...prev,
        phase: 'bidding',
        players: {
          south: { ...prev.players.south, hand: south, bid: null, tricksWon: 0 },
          west: { ...prev.players.west, hand: west, bid: null, tricksWon: 0 },
          north: { ...prev.players.north, hand: north, bid: null, tricksWon: 0 },
          east: { ...prev.players.east, hand: east, bid: null, tricksWon: 0 },
        },
        currentPlayer: firstBidder,
        dealer: newDealer,
        spadesBroken: false,
        roundNumber: prev.roundNumber + 1,
        currentTrick: { cards: [], leader: firstBidder },
        completedTricks: [],
        message: `Round ${prev.roundNumber + 1} - Time to bid!`,
      };
    });
  }, []);

  // Handle bidding
  const placeBid = useCallback((bid: number) => {
    setState(prev => {
      if (prev.phase !== 'bidding') return prev;

      const newPlayers = { ...prev.players };
      newPlayers[prev.currentPlayer] = { ...newPlayers[prev.currentPlayer], bid };

      // Check if all players have bid
      const allBid = POSITION_ORDER.every(pos => newPlayers[pos].bid !== null);
      const nextPlayer = getNextPlayer(prev.currentPlayer);

      if (allBid) {
        // Move to playing phase - player left of dealer leads
        const firstPlayer = getNextPlayer(prev.dealer);
        return {
          ...prev,
          players: newPlayers,
          phase: 'playing',
          currentPlayer: firstPlayer,
          currentTrick: { cards: [], leader: firstPlayer },
          message: `All bids placed! ${newPlayers[firstPlayer].name} ${firstPlayer === 'south' ? 'lead' : 'leads'}.`,
        };
      }

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
        message: `${newPlayers[prev.currentPlayer].name} ${prev.currentPlayer === 'south' ? 'bid' : 'bids'} ${bid === 0 ? 'Nil' : bid}.`,
      };
    });
  }, []);

  // Play a card
  const playCard = useCallback((card: Card) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      if (prev.currentPlayer !== 'south') return prev;

      const legal = getLegalPlays(prev.players.south.hand, prev.currentTrick, prev.spadesBroken);
      if (!legal.some(c => sameCard(c, card))) return prev;

      return applyCardPlay(prev, 'south', card);
    });
  }, []);

  // Apply a card play (works for both human and AI)
  function applyCardPlay(prevState: GameState, player: PlayerPosition, card: Card): GameState {
    const newState = { ...prevState };
    const newPlayers = { ...newState.players };
    const playerData = { ...newPlayers[player] };
    playerData.hand = playerData.hand.filter(c => !sameCard(c, card));
    newPlayers[player] = playerData;

    const newTrick: Trick = {
      ...newState.currentTrick,
      cards: [...newState.currentTrick.cards, { player, card }],
    };

    let spadesBroken = newState.spadesBroken;
    if (card.suit === 'spades') spadesBroken = true;

    // Check if trick is complete
    if (newTrick.cards.length === 4) {
      const winner = getTrickWinner(newTrick);
      const winnerData = { ...newPlayers[winner] };
      winnerData.tricksWon += 1;
      newPlayers[winner] = winnerData;

      // Check if round is over (all cards played)
      const totalTricks = POSITION_ORDER.reduce((sum, pos) => sum + newPlayers[pos].tricksWon, 0);

      if (totalTricks === 13) {
        // Round over - calculate scores
        const nsScore = calculateTeamRoundScore(
          newPlayers.south.bid!, newPlayers.south.tricksWon,
          newPlayers.north.bid!, newPlayers.north.tricksWon
        );
        const ewScore = calculateTeamRoundScore(
          newPlayers.west.bid!, newPlayers.west.tricksWon,
          newPlayers.east.bid!, newPlayers.east.tricksWon
        );

        const newScores = { ...newState.scores };
        newScores.northSouth = {
          totalScore: newScores.northSouth.totalScore + nsScore.score,
          bags: newScores.northSouth.bags + nsScore.bags,
          roundScores: [...newScores.northSouth.roundScores, nsScore],
        };
        newScores.eastWest = {
          totalScore: newScores.eastWest.totalScore + ewScore.score,
          bags: newScores.eastWest.bags + ewScore.bags,
          roundScores: [...newScores.eastWest.roundScores, ewScore],
        };

        // Bag penalty: 10 cumulative bags = -100
        if (newScores.northSouth.bags >= 10) {
          newScores.northSouth.totalScore -= 100;
          newScores.northSouth.bags -= 10;
        }
        if (newScores.eastWest.bags >= 10) {
          newScores.eastWest.totalScore -= 100;
          newScores.eastWest.bags -= 10;
        }

        const gameOver = newScores.northSouth.totalScore >= newState.targetScore ||
          newScores.eastWest.totalScore >= newState.targetScore;

        return {
          ...newState,
          players: newPlayers,
          currentTrick: { cards: newTrick.cards, leader: newTrick.leader, winner },
          completedTricks: [...newState.completedTricks, { ...newTrick, winner }],
          scores: newScores,
          spadesBroken,
          phase: gameOver ? 'gameOver' : 'roundEnd',
          currentPlayer: winner,
          message: `${newPlayers[winner].name} ${winner === 'south' ? 'win' : 'wins'} the last trick! Round over.`,
          lastTrickWinner: winner,
        };
      }

      // Trick complete but round continues
      return {
        ...newState,
        players: newPlayers,
        currentTrick: { cards: newTrick.cards, leader: newTrick.leader, winner },
        completedTricks: [...newState.completedTricks, { ...newTrick, winner }],
        spadesBroken,
        phase: 'trickEnd',
        currentPlayer: winner,
        message: `${newPlayers[winner].name} ${winner === 'south' ? 'win' : 'wins'} the trick!`,
        lastTrickWinner: winner,
      };
    }

    // Trick not complete - next player
    const nextPlayer = getNextPlayer(player);
    return {
      ...newState,
      players: newPlayers,
      currentTrick: newTrick,
      spadesBroken,
      currentPlayer: nextPlayer,
      message: `${newPlayers[player].name} ${player === 'south' ? 'play' : 'plays'} ${card.rank} of ${card.suit}. ${newPlayers[nextPlayer].name}'s turn.`,
    };
  }

  // AI plays - triggered by effect when it's an AI player's turn
  useEffect(() => {
    if (state.phase === 'trickEnd') {
      // Brief pause to show completed trick
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          phase: 'playing',
          currentTrick: { cards: [], leader: prev.lastTrickWinner! },
          message: `${prev.players[prev.lastTrickWinner!].name} ${prev.lastTrickWinner === 'south' ? 'lead' : 'leads'}.`,
        }));
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (state.phase === 'bidding' && state.currentPlayer !== 'south') {
      const timer = setTimeout(() => {
        const player = state.players[state.currentPlayer];
        const bid = aiBid(player.hand, difficulty);
        placeBid(bid);
      }, 800);
      aiTimerRef.current = timer as any;
      return () => clearTimeout(timer);
    }

    if (state.phase === 'playing' && state.currentPlayer !== 'south') {
      const timer = setTimeout(() => {
        setState(prev => {
          const player = prev.players[prev.currentPlayer];
          const card = aiPlayCard(player.hand, prev.currentTrick, prev, prev.currentPlayer, difficulty);
          return applyCardPlay(prev, prev.currentPlayer, card);
        });
      }, 600);
      aiTimerRef.current = timer as any;
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentPlayer, difficulty, placeBid]);

  // Fetch coaching advice from Ollama when it's player's turn
  useEffect(() => {
    if (state.currentPlayer !== 'south') return;
    if (state.phase !== 'playing' && state.phase !== 'bidding') return;

    const controller = new AbortController();
    fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hand: state.players.south.hand.map(c => `${c.rank}${c.suit[0]}`).join(', '),
        trick: state.currentTrick.cards.map(e => `${e.card.rank}${e.card.suit[0]}`).join(', ') || 'none',
        bid: state.players.south.bid,
        tricksWon: state.players.south.tricksWon,
        teamScore: state.scores.northSouth.totalScore,
        opponentScore: state.scores.eastWest.totalScore,
        phase: state.phase,
      }),
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => setCoachMessage(data.message))
      .catch(() => {
        setCoachMessage(getClientCoachAdvice(
          state.phase,
          state.players.south.hand,
          state.players.south.bid,
          state.players.south.tricksWon,
          state.currentTrick.cards.length,
        ));
      });

    return () => controller.abort();
  }, [state.phase, state.currentPlayer, state.completedTricks.length, state.currentTrick.cards.length, state.players.south.hand.length]);

  return {
    state,
    difficulty,
    showHints,
    coachMessage,
    startGame,
    startNewRound,
    playCard,
    placeBid,
    setDifficulty,
    setShowHints: () => setShowHints(h => !h),
    setCoachMessage,
  };
}
