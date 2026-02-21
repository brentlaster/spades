import type { GameState } from '../game/types';

interface ScoreBoardProps {
  state: GameState;
}

export function ScoreBoard({ state }: ScoreBoardProps) {
  const { scores, players } = state;

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 text-sm min-w-[200px]">
      <h3 className="text-gold font-bold text-center mb-3 text-base">Score Board</h3>

      <div className="space-y-3">
        {/* Your Team */}
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-green-300 font-semibold">Your Team</span>
            <span className="text-xl font-bold text-white">{scores.northSouth.totalScore}</span>
          </div>
          <div className="flex justify-between text-white/60 text-xs">
            <span>{players.south.name} & {players.north.name}</span>
            <span>Bags: {scores.northSouth.bags}</span>
          </div>
          <div className="flex justify-between text-white/60 text-xs mt-1">
            <span>Bid: {(players.south.bid ?? '-')} + {(players.north.bid ?? '-')}</span>
            <span>Won: {players.south.tricksWon + players.north.tricksWon}</span>
          </div>
        </div>

        {/* Opponent Team */}
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-red-300 font-semibold">Opponents</span>
            <span className="text-xl font-bold text-white">{scores.eastWest.totalScore}</span>
          </div>
          <div className="flex justify-between text-white/60 text-xs">
            <span>{players.west.name} & {players.east.name}</span>
            <span>Bags: {scores.eastWest.bags}</span>
          </div>
          <div className="flex justify-between text-white/60 text-xs mt-1">
            <span>Bid: {(players.west.bid ?? '-')} + {(players.east.bid ?? '-')}</span>
            <span>Won: {players.west.tricksWon + players.east.tricksWon}</span>
          </div>
        </div>
      </div>

      {/* Target */}
      <div className="text-center text-white/40 text-xs mt-3">
        Playing to {state.targetScore} | Round {state.roundNumber}
      </div>
    </div>
  );
}

export function MiniScore({ state }: ScoreBoardProps) {
  return (
    <div className="flex gap-4 text-sm">
      <div className="bg-green-900/50 rounded-lg px-3 py-1">
        <span className="text-green-300">You:</span>{' '}
        <span className="font-bold">{state.scores.northSouth.totalScore}</span>
      </div>
      <div className="bg-red-900/50 rounded-lg px-3 py-1">
        <span className="text-red-300">Them:</span>{' '}
        <span className="font-bold">{state.scores.eastWest.totalScore}</span>
      </div>
    </div>
  );
}
