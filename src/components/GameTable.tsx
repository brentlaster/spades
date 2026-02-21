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

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center px-3 md:px-4 py-2 bg-black/20 safe-top">
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-gold font-bold text-base md:text-lg">{SUIT_SYMBOLS.spades} Spades</h1>
          <span className="text-white/40 text-xs md:text-sm">R{state.roundNumber}</span>
        </div>

        {/* Mobile: mini score + score toggle */}
        <div className="flex md:hidden items-center gap-2">
          <MiniScore state={state} />
          <button
            onClick={() => setShowScorePanel(!showScorePanel)}
            className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs"
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

      {/* Mobile score panel overlay */}
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
        <div className="flex-1 flex flex-col justify-between py-2 md:py-4 min-h-0">
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
          <div className="flex items-center justify-center gap-2 md:gap-8 px-1 min-h-0">
            {/* West player */}
            <div className="text-center flex-shrink-0">
              <PlayerLabel player={state.players.west} isCurrentPlayer={state.currentPlayer === 'west'} compact />
              <div className="flex flex-col items-center mt-1">
                {state.players.west.hand.slice(0, Math.min(state.players.west.hand.length, 4)).map((_, i) => (
                  <CardBack key={i} small className="rotate-90" style={{ marginTop: i > 0 ? '-58px' : '0' }} />
                ))}
              </div>
            </div>

            {/* Trick area / Bidding / Panels */}
            <div className="flex-shrink-0 flex-1 flex justify-center max-w-sm">
              {state.phase === 'bidding' ? (
                <BiddingPanel state={state} onBid={onBid} />
              ) : state.phase === 'roundEnd' ? (
                <RoundEndPanel state={state} onNewRound={onNewRound} />
              ) : state.phase === 'gameOver' ? (
                <GameOverPanel state={state} onNewGame={onNewGame} />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <TrickArea trick={state.currentTrick} message={state.message} />
                  {/* Mobile coach message */}
                  {coachMessage && (
                    <div className="md:hidden bg-purple-900/40 rounded-lg px-3 py-1.5 text-xs text-white/80 max-w-[250px] text-center">
                      {coachMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* East player */}
            <div className="text-center flex-shrink-0">
              <PlayerLabel player={state.players.east} isCurrentPlayer={state.currentPlayer === 'east'} compact />
              <div className="flex flex-col items-center mt-1">
                {state.players.east.hand.slice(0, Math.min(state.players.east.hand.length, 4)).map((_, i) => (
                  <CardBack key={i} small className="rotate-90" style={{ marginTop: i > 0 ? '-58px' : '0' }} />
                ))}
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
    <div className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm ${
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
