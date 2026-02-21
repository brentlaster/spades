import { useGame } from '../hooks/useGame';
import { GameTable } from '../components/GameTable';
import { SUIT_SYMBOLS } from '../game/types';

interface PlayProps {
  onHome: () => void;
  onLearn: () => void;
}

export function Play({ onHome, onLearn }: PlayProps) {
  const {
    state, difficulty, showHints, coachMessage,
    startGame, startNewRound, playCard, placeBid,
    setDifficulty, setShowHints
  } = useGame();

  if (state.phase === 'idle') {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center max-w-md w-full">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4">{SUIT_SYMBOLS.spades}</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Play?</h2>
          <p className="text-white/60 mb-6 md:mb-8 text-sm md:text-base">
            You'll team up with Alex (AI partner) against Maya and Jordan.
            First team to 500 points wins!
          </p>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-sm text-white/60 block mb-2">AI Difficulty</label>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 px-3 rounded-lg capitalize text-sm font-semibold transition-all cursor-pointer ${
                      difficulty === d ? 'bg-gold text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gold text-black py-4 rounded-2xl font-bold text-xl hover:bg-gold-light
                transition-all hover:scale-105 cursor-pointer"
            >
              Deal the Cards!
            </button>

            <div className="flex gap-3">
              <button
                onClick={onLearn}
                className="flex-1 bg-white/10 text-white/70 py-2 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                Learn First
              </button>
              <button
                onClick={onHome}
                className="flex-1 bg-white/10 text-white/70 py-2 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameTable
      state={state}
      onPlayCard={playCard}
      onBid={placeBid}
      onNewRound={startNewRound}
      onNewGame={startGame}
      showHints={showHints}
      onToggleHints={setShowHints}
      difficulty={difficulty}
      onSetDifficulty={setDifficulty}
      coachMessage={coachMessage}
    />
  );
}
