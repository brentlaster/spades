import { useState } from 'react';
import type { GameState, PlayerPosition } from '../game/types';
import { POSITION_ORDER, getPartner, SUIT_SYMBOLS } from '../game/types';

interface BiddingPanelProps {
  state: GameState;
  onBid: (bid: number) => void;
}

export function BiddingPanel({ state, onBid }: BiddingPanelProps) {
  const [selectedBid, setSelectedBid] = useState<number | null>(null);
  const player = state.players.south;

  // Show all bids so far
  const bidOrder = getBidOrder(state.dealer);

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 md:p-6 max-w-md mx-auto animate-slide-in">
      <h3 className="text-gold font-bold text-lg md:text-xl text-center mb-3 md:mb-4">
        {SUIT_SYMBOLS.spades} Bidding Phase
      </h3>

      {/* Bids placed so far */}
      <div className="grid grid-cols-4 gap-1 md:gap-2 mb-4 md:mb-6">
        {POSITION_ORDER.map(pos => {
          const p = state.players[pos];
          const isCurrent = pos === state.currentPlayer;
          return (
            <div
              key={pos}
              className={`text-center p-1.5 md:p-2 rounded-lg ${
                isCurrent ? 'bg-gold/20 ring-2 ring-gold' : 'bg-white/5'
              }`}
            >
              <div className="text-[10px] md:text-xs text-white/60 capitalize">{pos}</div>
              <div className="font-semibold text-xs md:text-sm">{p.name}</div>
              <div className="text-base md:text-lg font-bold mt-0.5 md:mt-1">
                {p.bid !== null ? (p.bid === 0 ? 'Nil' : p.bid) : (isCurrent ? '...' : '-')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Player bidding controls */}
      {state.currentPlayer === 'south' && (
        <div>
          <p className="text-white/70 text-sm text-center mb-3">
            Choose your bid (how many tricks you think you'll win):
          </p>

          {/* Partner's bid info */}
          {state.players.north.bid !== null && (
            <p className="text-green-300 text-sm text-center mb-3">
              Your partner ({state.players.north.name}) bid {state.players.north.bid === 0 ? 'Nil' : state.players.north.bid}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-3 md:mb-4">
            {/* Nil bid */}
            <button
              onClick={() => setSelectedBid(0)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all ${
                selectedBid === 0
                  ? 'bg-gold text-black scale-110'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Nil
            </button>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(n => (
              <button
                key={n}
                onClick={() => setSelectedBid(n)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all ${
                  selectedBid === n
                    ? 'bg-gold text-black scale-110'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => selectedBid !== null && onBid(selectedBid)}
              disabled={selectedBid === null}
              className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                selectedBid !== null
                  ? 'bg-gold text-black hover:bg-gold-light cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {selectedBid === null ? 'Select a Bid' :
               selectedBid === 0 ? 'Bid Nil!' : `Bid ${selectedBid}`}
            </button>
          </div>

          {/* Bidding tip */}
          <div className="mt-4 bg-blue-900/30 rounded-lg p-3 text-sm text-blue-200">
            <strong>Tip:</strong> Count your high cards (Aces, Kings) and spades.
            Each Ace is usually worth 1 trick. Don't overbid!
          </div>
        </div>
      )}

      {state.currentPlayer !== 'south' && (
        <div className="text-center text-white/60">
          Waiting for {state.players[state.currentPlayer].name} to bid...
        </div>
      )}
    </div>
  );
}

function getBidOrder(dealer: PlayerPosition): PlayerPosition[] {
  const idx = POSITION_ORDER.indexOf(dealer);
  const order: PlayerPosition[] = [];
  for (let i = 1; i <= 4; i++) {
    order.push(POSITION_ORDER[(idx + i) % 4]);
  }
  return order;
}
