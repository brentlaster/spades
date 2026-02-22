import { SUIT_SYMBOLS } from '../game/types';
import { CardView } from '../components/Card';

interface HomeProps {
  onStartGame: () => void;
  onLearn: () => void;
}

export function Home({ onStartGame, onLearn }: HomeProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Hero */}
      <div className="text-center mb-8 md:mb-12 animate-fade-in">
        <div className="text-6xl md:text-8xl mb-3 md:mb-4">{SUIT_SYMBOLS.spades}</div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 md:mb-3">Spades Master</h1>
        <p className="text-base md:text-xl text-white/60 max-w-lg mx-auto px-4">
          Learn to play Spades from beginner to expert. Interactive tutorials,
          AI opponents, and real-time coaching.
        </p>
      </div>

      {/* Cards display */}
      <div className="flex gap-2 md:gap-3 mb-8 md:mb-12 animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <CardView card={{ suit: 'spades', rank: 'A' }} style={{ transform: 'rotate(-15deg)' }} />
        <CardView card={{ suit: 'hearts', rank: 'K' }} style={{ transform: 'rotate(-5deg)' }} />
        <CardView card={{ suit: 'diamonds', rank: 'Q' }} style={{ transform: 'rotate(5deg)' }} />
        <CardView card={{ suit: 'clubs', rank: 'J' }} style={{ transform: 'rotate(15deg)' }} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12 w-full max-w-md sm:w-auto animate-slide-in" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={onStartGame}
          className="bg-gold text-black px-8 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-lg md:text-xl hover:bg-gold-light
            transition-all hover:scale-105 shadow-lg shadow-gold/20 cursor-pointer"
        >
          {SUIT_SYMBOLS.spades} Play Now
        </button>
        <button
          onClick={onLearn}
          className="bg-white/10 text-white px-8 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-lg md:text-xl hover:bg-white/20
            transition-all hover:scale-105 border border-white/20 cursor-pointer"
        >
          Learn the Rules
        </button>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl w-full animate-slide-in" style={{ animationDelay: '0.6s' }}>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl mb-2 md:mb-3">📚</div>
          <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Step-by-Step Lessons</h3>
          <p className="text-white/60 text-xs md:text-sm">Learn tricks, bidding, scoring, and strategy from beginner to advanced</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl mb-2 md:mb-3">🤖</div>
          <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Smart AI Opponents</h3>
          <p className="text-white/60 text-xs md:text-sm">Play against 3 difficulty levels of AI that adapt to your skill</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center">
          <div className="text-2xl md:text-3xl mb-2 md:mb-3">💡</div>
          <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">Real-Time Hints</h3>
          <p className="text-white/60 text-xs md:text-sm">Get coaching tips and card play suggestions as you learn</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 md:mt-12 text-center text-white/40 text-xs md:text-sm">
        <p>by Tech Skills Transformations</p>
        <p className="mt-1">&copy; 2026 Tech Skills Transformations. All rights reserved.</p>
      </div>
    </div>
  );
}
