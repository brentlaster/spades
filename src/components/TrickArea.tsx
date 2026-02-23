import type { Trick, PlayerPosition } from '../game/types';
import { CardView } from './Card';

interface TrickAreaProps {
  trick: Trick;
  lastTrickWinner?: PlayerPosition;
  message?: string;
}

const POSITION_STYLES: Record<PlayerPosition, React.CSSProperties> = {
  south: { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
  north: { top: '0', left: '50%', transform: 'translateX(-50%)' },
  west: { left: '0', top: '50%', transform: 'translateY(-50%)' },
  east: { right: '0', top: '50%', transform: 'translateY(-50%)' },
};

export function TrickArea({ trick, message }: TrickAreaProps) {
  return (
    <div className="relative w-52 h-40 md:w-64 md:h-48 mx-auto">
      {/* Center message */}
      {message && trick.cards.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 md:px-6 py-2 md:py-3 text-center animate-fade-in">
            <p className="text-white/90 text-xs md:text-sm">{message}</p>
          </div>
        </div>
      )}

      {/* Played cards */}
      {trick.cards.map((entry, i) => (
        <div
          key={`${entry.card.rank}-${entry.card.suit}-${i}`}
          className="absolute animate-slide-in"
          style={{
            ...POSITION_STYLES[entry.player],
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <CardView card={entry.card} small />
        </div>
      ))}
    </div>
  );
}
