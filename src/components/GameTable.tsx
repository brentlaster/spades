import type { Card, GameState } from '../game/types';
import { SUIT_SYMBOLS } from '../game/types';
import { PlayerHand } from './PlayerHand';
import { TrickArea } from './TrickArea';
import { ScoreBoard, MiniScore } from './ScoreBoard';
import { BiddingPanel } from './BiddingPanel';
import { CardBack } from './Card';
import type { AIDifficulty } from '../game/ai';
import { useState } from 'react';

interface GameTableProps {
  state: GameState;
  onPlayCard: (card: Card) => void;
  onBid: (bid: number) => void;
  onNewRound: () => void;
  onNewGame: () => void;
  showHints: boolean;
  onToggleHints: () => void;
  difficulty: AIDifficulty;
  onSetDifficulty: (d: AIDifficulty) => void;
  coachMessage?: string;
}

export function GameTable({
  state, onPlayCard, onBid, onNewRound, onNewGame,
  showHints, onToggleHints, difficulty, onSetDifficulty, coachMessage
}: GameTableProps) {
  const [showScorePanel, setShowScorePanel] = useState(false);
  const [showCoach, setShowCoach] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center px-3 md:px-4 py-2 bg-black/20 safe-top">
        <div className="flex items-center gap-2 md:gap-3">
          <div>
            <h1 className="text-gold font-bold text-base md:text-lg leading-tight">{SUIT_SYMBOLS.spades} Spades <span className="text-white/40 text-xs md:text-sm font-normal">R{state.roundNumber}</span></h1>
            <p className="text-[9px] md:text-[11px] text-white/25 leading-tight">by Tech Skills Transformations &copy; 2026</p>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1.5">
          <MiniScore state={state} />
          {coachMessage && (
            <button
              onClick={() => { setShowCoach(!showCoach); setShowScorePanel(false); }}
              className={`px-2 py-1 rounded-lg text-xs ${showCoach ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70'}`}
            >
              Coach
            </button>
          )}
          <button
            onClick={() => { setShowScorePanel(!showScorePanel); setShowCoach(false); }}
            className={`px-2 py-1 rounded-lg text-xs ${showScorePanel ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'}`}
          >
            {showScorePanel ? 'Hide' : 'Score'}
          </button>
        </div>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleHints}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              showHints ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {showHints ? 'Hints On' : 'Hints Off'}
          </button>
          <select
            value={difficulty}
            onChange={e => onSetDifficulty(e.target.value as AIDifficulty)}
            className="bg-white/10 text-white text-sm rounded-lg px-2 py-1 border-none outline-none"
          >
            <option value="beginner">Beginner AI</option>
            <option value="intermediate">Intermediate AI</option>
            <option value="advanced">Advanced AI</option>
          </select>
        </div>
      </div>

      {/* Mobile overlay panels */}
      {showScorePanel && (
        <div className="md:hidden absolute top-12 left-0 right-0 z-50 p-3 animate-slide-in">
          <ScoreBoard state={state} />
          <div className="flex gap-2 mt-2">
            <button
              onClick={onToggleHints}
              className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                showHints ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              {showHints ? 'Hints On' : 'Hints Off'}
            </button>
            <select
              value={difficulty}
              onChange={e => onSetDifficulty(e.target.value as AIDifficulty)}
              className="flex-1 bg-white/10 text-white text-sm rounded-lg px-2 py-2 border-none outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      )}

      {showCoach && coachMessage && (
        <div className="md:hidden absolute top-12 left-0 right-0 z-50 p-3 animate-slide-in">
          <div className="bg-purple-900/80 backdrop-blur-sm rounded-xl p-4">
            <div className="text-purple-300 font-semibold mb-2">AI Coach</div>
            <p className="text-white/90 text-sm leading-relaxed">{coachMessage}</p>
          </div>
        </div>
      )}

      {/* Main table area */}
      <div className="flex-1 flex min-h-0">
        {/* Left scoreboard - desktop only */}
        <div className="hidden md:flex w-56 p-3 flex-col gap-3">
          <ScoreBoard state={state} />
          {coachMessage && (
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-3 text-sm animate-slide-in">
              <div className="text-purple-300 font-semibold mb-1">AI Coach</div>
              <p className="text-white/80 text-xs leading-relaxed">{coachMessage}</p>
            </div>
          )}
        </div>

        {/* Center play area */}
        <div className="flex-1 flex flex-col justify-between py-1 md:py-4 min-h-0 w-full overflow-hidden">
          {/* North player (partner) */}
          <div className="text-center px-2">
            <PlayerLabel player={state.players.north} isCurrentPlayer={state.currentPlayer === 'north'} />
            <div className="mt-1">
              <div className="flex justify-center">
                {state.players.north.hand.map((_, i) => (
                  <CardBack key={i} small style={{ marginLeft: i > 0 ? '-32px' : '0' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Middle row: West - Trick - East */}
          <div className="flex items-center justify-between px-1 md:px-4 min-h-0 w-full">
            {/* West player - compact on mobile */}
            <div className="text-center w-12 md:w-auto flex-shrink-0">
              <PlayerLabel player={state.players.west} isCurrentPlayer={state.currentPlayer === 'west'} compact />
              <div className="hidden md:flex flex-col items-center mt-1">
                {state.players.west.hand.slice(0, 4).map((_, i) => (
                  <CardBack key={i} small className="rotate-90" style={{ marginTop: i > 0 ? '-58px' : '0' }} />
                ))}
              </div>
              {/* Mobile: just show card count */}
              <div className="md:hidden text-[10px] text-white/40 mt-1">
                {state.players.west.hand.length} cards
              </div>
            </div>

            {/* Trick area / Bidding / Panels */}
            <div className="flex-1 flex justify-center min-w-0 mx-1 md:mx-4">
              {state.phase === 'bidding' ? (
                <BiddingPanel state={state} onBid={onBid} />
              ) : state.phase === 'roundEnd' ? (
                <RoundEndPanel state={state} onNewRound={onNewRound} />
              ) : state.phase === 'gameOver' ? (
                <GameOverPanel state={state} onNewGame={onNewGame} />
              ) : (
                <TrickArea trick={state.currentTrick} message={state.message} />
              )}
            </div>

            {/* East player - compact on mobile */}
            <div className="text-center w-12 md:w-auto flex-shrink-0">
              <PlayerLabel player={state.players.east} isCurrentPlayer={state.currentPlayer === 'east'} compact />
              <div className="hidden md:flex flex-col items-center mt-1">
                {state.players.east.hand.slice(0, 4).map((_, i) => (
                  <CardBack key={i} small className="rotate-90" style={{ marginTop: i > 0 ? '-58px' : '0' }} />
                ))}
              </div>
              {/* Mobile: just show card count */}
              <div className="md:hidden text-[10px] text-white/40 mt-1">
                {state.players.east.hand.length} cards
              </div>
            </div>
          </div>

          {/* South player (human) */}
          <div className="safe-bottom">
            <PlayerHand
              cards={state.players.south.hand}
              isHuman={true}
              isCurrentPlayer={state.currentPlayer === 'south' && state.phase === 'playing'}
              trick={state.currentTrick}
              spadesBroken={state.spadesBroken}
              onPlayCard={onPlayCard}
              showHints={showHints}
              gameState={state}
            />
            <div className="text-center mt-1 md:mt-2">
              <PlayerLabel player={state.players.south} isCurrentPlayer={state.currentPlayer === 'south'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerLabel({ player, isCurrentPlayer, compact }: { player: any; isCurrentPlayer: boolean; compact?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-sm ${
      isCurrentPlayer ? 'bg-gold/20 text-gold ring-1 ring-gold animate-pulse-slow' : 'bg-white/5 text-white/70'
    }`}>
      <span className="font-semibold">{player.name}</span>
      {!compact && player.bid !== null && (
        <span className="text-[10px] md:text-xs bg-white/10 px-1.5 md:px-2 py-0.5 rounded-full">
          {player.bid === 0 ? 'Nil' : `B${player.bid}`} | W{player.tricksWon}
        </span>
      )}
      {compact && player.bid !== null && (
        <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded-full">
          {player.bid === 0 ? 'N' : player.bid}/{player.tricksWon}
        </span>
      )}
      {!compact && player.isHuman && <span className="text-[10px] md:text-xs text-green-400">(You)</span>}
    </div>
  );
}

function RoundEndPanel({ state, onNewRound }: { state: GameState; onNewRound: () => void }) {
  const ns = state.scores.northSouth;
  const ew = state.scores.eastWest;
  const lastNS = ns.roundScores[ns.roundScores.length - 1];
  const lastEW = ew.roundScores[ew.roundScores.length - 1];

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center animate-slide-in max-w-sm mx-3">
      <h3 className="text-gold font-bold text-lg md:text-xl mb-3 md:mb-4">Round {state.roundNumber} Complete!</h3>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
        <div className="bg-green-900/30 rounded-lg p-2 md:p-3">
          <div className="text-green-300 font-semibold mb-1 text-sm">Your Team</div>
          {lastNS && (
            <>
              <div className="text-xl md:text-2xl font-bold">{lastNS.score > 0 ? '+' : ''}{lastNS.score}</div>
              <div className="text-[10px] md:text-xs text-white/60">
                Bid {lastNS.bid} | Won {lastNS.tricks} | Bags +{lastNS.bags}
              </div>
            </>
          )}
          <div className="text-xs md:text-sm mt-1 md:mt-2 text-white/80">Total: {ns.totalScore}</div>
        </div>

        <div className="bg-red-900/30 rounded-lg p-2 md:p-3">
          <div className="text-red-300 font-semibold mb-1 text-sm">Opponents</div>
          {lastEW && (
            <>
              <div className="text-xl md:text-2xl font-bold">{lastEW.score > 0 ? '+' : ''}{lastEW.score}</div>
              <div className="text-[10px] md:text-xs text-white/60">
                Bid {lastEW.bid} | Won {lastEW.tricks} | Bags +{lastEW.bags}
              </div>
            </>
          )}
          <div className="text-xs md:text-sm mt-1 md:mt-2 text-white/80">Total: {ew.totalScore}</div>
        </div>
      </div>

      <button
        onClick={onNewRound}
        className="bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all cursor-pointer"
      >
        Next Round
      </button>
    </div>
  );
}

function GameOverPanel({ state, onNewGame }: { state: GameState; onNewGame: () => void }) {
  const nsWon = state.scores.northSouth.totalScore >= state.targetScore;

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center animate-slide-in max-w-sm mx-3">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        {nsWon ? 'You Win!' : 'Game Over'}
      </h2>
      <p className="text-white/70 mb-4 md:mb-6 text-sm md:text-base">
        {nsWon ? 'Congratulations! You and your partner reached ' : 'The opponents reached '}
        {state.targetScore} points!
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4 md:mb-6">
        <div className={`rounded-lg p-3 ${nsWon ? 'bg-gold/20 ring-2 ring-gold' : 'bg-white/5'}`}>
          <div className="font-semibold mb-1 text-sm">Your Team</div>
          <div className="text-2xl md:text-3xl font-bold">{state.scores.northSouth.totalScore}</div>
        </div>
        <div className={`rounded-lg p-3 ${!nsWon ? 'bg-gold/20 ring-2 ring-gold' : 'bg-white/5'}`}>
          <div className="font-semibold mb-1 text-sm">Opponents</div>
          <div className="text-2xl md:text-3xl font-bold">{state.scores.eastWest.totalScore}</div>
        </div>
      </div>

      <button
        onClick={onNewGame}
        className="bg-gold text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-gold-light transition-all cursor-pointer"
      >
        Play Again
      </button>
    </div>
  );
}
