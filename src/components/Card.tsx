import type { Card as CardType } from '../game/types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../game/types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  small?: boolean;
  faceDown?: boolean;
  style?: React.CSSProperties;
  className?: string;
  hint?: string;
}

export function CardView({ card, onClick, selected, disabled, small, faceDown, style, className = '', hint }: CardProps) {
  if (faceDown) {
    return <div className={`card-back ${small ? 'card-sm' : ''} ${className}`} style={style} />;
  }

  const symbol = SUIT_SYMBOLS[card.suit];
  const color = SUIT_COLORS[card.suit];

  return (
    <div
      className={`card ${small ? 'card-sm' : ''} ${selected ? 'card-selected' : ''} ${disabled ? 'card-disabled' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      style={{ ...style, color }}
      title={hint}
    >
      {/* Top-left rank and suit */}
      <div className="absolute top-1 left-1.5 leading-tight" style={{ fontSize: small ? '0.6rem' : '0.75rem' }}>
        <div className="font-bold">{card.rank}</div>
        <div className="-mt-1">{symbol}</div>
      </div>

      {/* Center suit */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: small ? '1.5rem' : '2rem' }}>
        {symbol}
      </div>

      {/* Bottom-right rank and suit (inverted) */}
      <div className="absolute bottom-1 right-1.5 leading-tight rotate-180" style={{ fontSize: small ? '0.6rem' : '0.75rem' }}>
        <div className="font-bold">{card.rank}</div>
        <div className="-mt-1">{symbol}</div>
      </div>
    </div>
  );
}

export function CardBack({ small, className = '', style }: { small?: boolean; className?: string; style?: React.CSSProperties }) {
  return <div className={`card-back ${small ? 'card-sm' : ''} ${className}`} style={style} />;
}
