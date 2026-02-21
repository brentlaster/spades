import { useState } from 'react';
import { CardView } from '../components/Card';
import type { Card } from '../game/types';
import { SUIT_SYMBOLS } from '../game/types';

interface Lesson {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  content: React.ReactNode;
}

const exampleCards: Record<string, Card> = {
  aceSpades: { suit: 'spades', rank: 'A' },
  kingSpades: { suit: 'spades', rank: 'K' },
  queenHearts: { suit: 'hearts', rank: 'Q' },
  jackDiamonds: { suit: 'diamonds', rank: 'J' },
  twoClubs: { suit: 'clubs', rank: '2' },
  threeSpades: { suit: 'spades', rank: '3' },
  aceHearts: { suit: 'hearts', rank: 'A' },
  kingHearts: { suit: 'hearts', rank: 'K' },
  fiveHearts: { suit: 'hearts', rank: '5' },
  tenDiamonds: { suit: 'diamonds', rank: '10' },
  sevenClubs: { suit: 'clubs', rank: '7' },
  aceClubs: { suit: 'clubs', rank: 'A' },
  twoSpades: { suit: 'spades', rank: '2' },
};

const lessons: Lesson[] = [
  {
    id: 'basics',
    title: 'What is Spades?',
    level: 'beginner',
    content: (
      <div className="space-y-4">
        <p>Spades is a <strong>trick-taking card game</strong> played with 4 players in 2 teams.
        You and a partner sit across from each other and compete against the other pair.</p>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">The Setup</h4>
          <ul className="space-y-2 text-white/80">
            <li>{SUIT_SYMBOLS.spades} Uses a standard 52-card deck</li>
            <li>{SUIT_SYMBOLS.spades} 4 players, 2 teams (partners sit across)</li>
            <li>{SUIT_SYMBOLS.spades} Each player gets 13 cards</li>
            <li>{SUIT_SYMBOLS.spades} Spades are always trump (the most powerful suit)</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">The Goal</h4>
          <p className="text-white/80">Be the first team to reach <strong>500 points</strong> by accurately
          predicting (bidding) how many tricks you'll win each round.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'cards',
    title: 'Card Rankings',
    level: 'beginner',
    content: (
      <div className="space-y-4">
        <p>Cards rank from <strong>2 (lowest)</strong> to <strong>Ace (highest)</strong> within each suit.</p>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-3">Rank Order (Low to High)</h4>
          <p className="text-white/70 text-sm mb-3">2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A</p>
          <div className="flex gap-2 flex-wrap justify-center">
            <CardView card={exampleCards.twoClubs} small />
            <CardView card={exampleCards.sevenClubs} small />
            <CardView card={exampleCards.jackDiamonds} small />
            <CardView card={exampleCards.queenHearts} small />
            <CardView card={exampleCards.kingSpades} small />
            <CardView card={exampleCards.aceSpades} small />
          </div>
        </div>

        <div className="bg-blue-900/30 rounded-xl p-4">
          <h4 className="text-blue-300 font-semibold mb-2">{SUIT_SYMBOLS.spades} Spades are Trump!</h4>
          <p className="text-white/80">Any spade beats any card of another suit. Even the 2 of spades
          beats the Ace of hearts!</p>
          <div className="flex gap-4 items-center justify-center mt-3">
            <div className="text-center">
              <CardView card={exampleCards.twoSpades} small />
              <div className="text-green-400 text-sm mt-1">WINS!</div>
            </div>
            <span className="text-2xl text-white/40">vs</span>
            <div className="text-center">
              <CardView card={exampleCards.aceHearts} small />
              <div className="text-red-400 text-sm mt-1">Loses</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tricks',
    title: 'How Tricks Work',
    level: 'beginner',
    content: (
      <div className="space-y-4">
        <p>A <strong>trick</strong> is one round of play where each player plays one card.
        There are 13 tricks per round.</p>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Playing a Trick</h4>
          <ol className="space-y-2 text-white/80 list-decimal list-inside">
            <li>One player <strong>leads</strong> (plays first) with any card</li>
            <li>Other players must <strong>follow suit</strong> (play the same suit) if they can</li>
            <li>If you can't follow suit, you can play any card (including a spade to trump!)</li>
            <li>The highest card of the led suit wins, unless someone played a spade</li>
          </ol>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-3">Example Trick</h4>
          <p className="text-white/70 text-sm mb-3">Player 1 leads with Queen of Hearts:</p>
          <div className="flex gap-3 items-end justify-center flex-wrap">
            <div className="text-center">
              <div className="text-xs text-white/50 mb-1">Lead</div>
              <CardView card={exampleCards.queenHearts} small />
              <div className="text-xs mt-1">{SUIT_SYMBOLS.hearts} Hearts led</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50 mb-1">Player 2</div>
              <CardView card={exampleCards.fiveHearts} small />
              <div className="text-xs mt-1">Follows suit</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50 mb-1">Player 3</div>
              <CardView card={exampleCards.kingHearts} small />
              <div className="text-xs text-green-400 mt-1">Wins!</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/50 mb-1">Player 4</div>
              <CardView card={exampleCards.aceHearts} small />
              <div className="text-xs text-green-400 mt-1">Actually wins!</div>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3 text-center">Ace of Hearts is the highest heart, so Player 4 wins this trick!</p>
        </div>

        <div className="bg-purple-900/30 rounded-xl p-4">
          <h4 className="text-purple-300 font-semibold mb-3">Trumping Example</h4>
          <p className="text-white/70 text-sm mb-3">What if Player 3 has no hearts?</p>
          <div className="flex gap-3 items-end justify-center flex-wrap">
            <div className="text-center">
              <CardView card={exampleCards.aceHearts} small />
              <div className="text-xs mt-1">Lead</div>
            </div>
            <div className="text-center">
              <CardView card={exampleCards.fiveHearts} small />
              <div className="text-xs mt-1">Follows</div>
            </div>
            <div className="text-center">
              <CardView card={exampleCards.threeSpades} small />
              <div className="text-xs text-green-400 mt-1">TRUMPS!</div>
            </div>
            <div className="text-center">
              <CardView card={exampleCards.kingHearts} small />
              <div className="text-xs mt-1">Follows</div>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3 text-center">Even the lowly 3{SUIT_SYMBOLS.spades} beats the A{SUIT_SYMBOLS.hearts}! That's the power of trump.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'bidding',
    title: 'Bidding',
    level: 'beginner',
    content: (
      <div className="space-y-4">
        <p>Before playing, each player <strong>bids</strong> how many tricks they expect to win.
        Your bid is a promise to your team!</p>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">How to Count Your Bid</h4>
          <ul className="space-y-2 text-white/80">
            <li><strong>Aces:</strong> Almost always win a trick = count 1 each</li>
            <li><strong>Kings:</strong> Usually win if you have 2+ cards in that suit = count ~0.7</li>
            <li><strong>Queens:</strong> Win if you have 3+ cards in that suit = count ~0.4</li>
            <li><strong>Long spades (5+):</strong> Extra spades often win tricks</li>
            <li><strong>Void suits:</strong> Having no cards in a suit means you can trump!</li>
          </ul>
        </div>

        <div className="bg-green-900/30 rounded-xl p-4">
          <h4 className="text-green-300 font-semibold mb-2">Example Hand</h4>
          <div className="flex gap-1 flex-wrap justify-center mb-3">
            <CardView card={{ suit: 'spades', rank: 'A' }} small />
            <CardView card={{ suit: 'spades', rank: 'Q' }} small />
            <CardView card={{ suit: 'spades', rank: '5' }} small />
            <CardView card={{ suit: 'hearts', rank: 'A' }} small />
            <CardView card={{ suit: 'hearts', rank: 'K' }} small />
            <CardView card={{ suit: 'hearts', rank: '7' }} small />
            <CardView card={{ suit: 'hearts', rank: '3' }} small />
            <CardView card={{ suit: 'diamonds', rank: 'K' }} small />
            <CardView card={{ suit: 'diamonds', rank: '9' }} small />
            <CardView card={{ suit: 'diamonds', rank: '4' }} small />
            <CardView card={{ suit: 'clubs', rank: '10' }} small />
            <CardView card={{ suit: 'clubs', rank: '6' }} small />
            <CardView card={{ suit: 'clubs', rank: '2' }} small />
          </div>
          <p className="text-white/70 text-sm">
            A{SUIT_SYMBOLS.spades} = 1 trick, Q{SUIT_SYMBOLS.spades} = maybe, A{SUIT_SYMBOLS.hearts} = 1 trick,
            K{SUIT_SYMBOLS.hearts} = likely 1 (4 hearts). <strong>Good bid: 3 or 4</strong>
          </p>
        </div>

        <div className="bg-yellow-900/30 rounded-xl p-4">
          <h4 className="text-yellow-300 font-semibold mb-2">{SUIT_SYMBOLS.spades} Nil Bid</h4>
          <p className="text-white/80">Bid <strong>Nil (0)</strong> if you think you won't win ANY tricks.
          Risky but rewarding!</p>
          <ul className="space-y-1 text-white/70 text-sm mt-2">
            <li>Success: +100 points for your team</li>
            <li>Failure: -100 points for your team</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'scoring',
    title: 'Scoring',
    level: 'beginner',
    content: (
      <div className="space-y-4">
        <p>Your team's bids are <strong>combined</strong>. If you bid 3 and your partner bids 4, your team needs at least 7 tricks.</p>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Making Your Bid</h4>
          <p className="text-white/80">Win <strong>at least</strong> as many tricks as your team bid:</p>
          <div className="bg-green-900/30 rounded-lg p-3 mt-2">
            <p className="text-green-300">Team bids 7, wins 7 = <strong>+70 points</strong> (10 per bid trick)</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Going Set (Failing)</h4>
          <p className="text-white/80">Win <strong>fewer</strong> tricks than your team bid:</p>
          <div className="bg-red-900/30 rounded-lg p-3 mt-2">
            <p className="text-red-300">Team bids 7, wins 5 = <strong>-70 points</strong></p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Bags (Overtricks)</h4>
          <p className="text-white/80">Extra tricks above your bid are called <strong>bags</strong>. They're worth 1 point each,
          but be careful:</p>
          <div className="bg-yellow-900/30 rounded-lg p-3 mt-2">
            <p className="text-yellow-300">Accumulate 10 bags = <strong>-100 point penalty!</strong></p>
            <p className="text-white/60 text-sm mt-1">Team bids 5, wins 8 = +53 points (50 + 3 bags)</p>
          </div>
        </div>

        <div className="bg-blue-900/30 rounded-xl p-4">
          <h4 className="text-blue-300 font-semibold mb-2">Winning</h4>
          <p className="text-white/80">First team to reach <strong>500 points</strong> wins the game!</p>
        </div>
      </div>
    ),
  },
  {
    id: 'spades-breaking',
    title: 'Breaking Spades',
    level: 'intermediate',
    content: (
      <div className="space-y-4">
        <p>You <strong>cannot lead with a spade</strong> until spades have been "broken" - meaning someone
        has played a spade on a previous trick (usually because they couldn't follow suit).</p>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Exception</h4>
          <p className="text-white/80">You CAN lead spades if your entire hand is spades - you have no choice!</p>
        </div>

        <div className="bg-purple-900/30 rounded-xl p-4">
          <h4 className="text-purple-300 font-semibold mb-2">Strategy Tip</h4>
          <p className="text-white/80">Sometimes you <em>want</em> to break spades early if you have many high spades.
          You can do this by playing a short suit so you run out, then trump when that suit is led.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'strategy-basic',
    title: 'Basic Strategy',
    level: 'intermediate',
    content: (
      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Leading Tips</h4>
          <ul className="space-y-2 text-white/80">
            <li><strong>Lead Aces:</strong> If you have an Ace of a non-spade suit, lead it early to guarantee a trick</li>
            <li><strong>Lead partner's suit:</strong> If your partner seems strong in a suit, lead it</li>
            <li><strong>Don't lead spades early:</strong> Save them for when you need them</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Following Tips</h4>
          <ul className="space-y-2 text-white/80">
            <li><strong>Partner winning?</strong> Play your lowest card - don't waste high cards</li>
            <li><strong>Opponent winning?</strong> Play high to try to win, or dump your lowest</li>
            <li><strong>Can't follow suit?</strong> Trump with a low spade if you need tricks, otherwise throw off a low card from your weakest suit</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Bidding Tips</h4>
          <ul className="space-y-2 text-white/80">
            <li><strong>Don't overbid:</strong> Going set (-70) is much worse than bags (+1 each)</li>
            <li><strong>Count conservatively:</strong> Only count tricks you're fairly sure of</li>
            <li><strong>Watch your partner:</strong> Don't bid assuming partner will cover for you</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'strategy-advanced',
    title: 'Advanced Strategy',
    level: 'advanced',
    content: (
      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Bag Management</h4>
          <p className="text-white/80">Watch your bag count! If you're at 7-8 bags, be very careful not to
          win extra tricks. Sometimes it's better to deliberately avoid winning a trick than to accumulate bags.</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Card Counting</h4>
          <ul className="space-y-2 text-white/80">
            <li>Track which high cards have been played</li>
            <li>Count how many cards of each suit have been played</li>
            <li>After 3 rounds of a suit, someone is likely void (can trump)</li>
            <li>If all higher cards in a suit are gone, your remaining cards are "good"</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Setting Opponents</h4>
          <p className="text-white/80">If opponents overbid, focus on winning tricks to prevent them from making their bid.
          Being "set" costs them 10 points per bid trick!</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Nil Defense</h4>
          <p className="text-white/80">When an opponent bids Nil:</p>
          <ul className="space-y-1 text-white/70">
            <li>Lead low cards in their short suits</li>
            <li>Try to force them to win a trick</li>
            <li>Play under their cards to trap them</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h4 className="text-gold font-semibold mb-2">Communication with Partner</h4>
          <p className="text-white/80">In Spades, you communicate through your plays:</p>
          <ul className="space-y-1 text-white/70">
            <li>Leading a high card shows strength in that suit</li>
            <li>Throwing off a low card signals you don't want that suit led</li>
            <li>Trumping early signals you're void in a suit</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'terminology',
    title: 'Glossary',
    level: 'beginner',
    content: (
      <div className="space-y-3">
        {[
          ['Trick', 'One round of play where each player plays one card (4 cards total)'],
          ['Trump', 'Spades! The most powerful suit that beats all others'],
          ['Bid', 'Your prediction of how many tricks you\'ll win'],
          ['Nil', 'A bid of zero - you promise to win NO tricks'],
          ['Bag', 'An overtrick (winning more than you bid). 10 bags = -100 penalty'],
          ['Set', 'Failing to make your bid. Costs -10 points per bid trick'],
          ['Follow Suit', 'Playing a card of the same suit that was led'],
          ['Void', 'Having no cards of a particular suit in your hand'],
          ['Lead', 'Playing the first card of a trick'],
          ['Breaking Spades', 'The first time a spade is played in a round'],
          ['Book', 'Another word for a trick you\'ve won'],
          ['Renege', 'Illegally not following suit when you could have (the game prevents this)'],
          ['Sluff/Throw Off', 'Playing a card of a different suit when you can\'t follow'],
        ].map(([term, def]) => (
          <div key={term} className="bg-white/5 rounded-lg p-3">
            <span className="text-gold font-semibold">{term}:</span>{' '}
            <span className="text-white/80">{def}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function Learn({ onStartGame }: { onStartGame: () => void }) {
  const [activeLesson, setActiveLesson] = useState<string>('basics');
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredLessons = filter === 'all' ? lessons : lessons.filter(l => l.level === filter);
  const currentLesson = lessons.find(l => l.id === activeLesson);

  const levelColors = {
    beginner: 'bg-green-600/20 text-green-300',
    intermediate: 'bg-yellow-600/20 text-yellow-300',
    advanced: 'bg-red-600/20 text-red-300',
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="bg-black/20 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between safe-top">
        <h1 className="text-lg md:text-2xl font-bold text-gold">{SUIT_SYMBOLS.spades} Learn Spades</h1>
        <button
          onClick={onStartGame}
          className="bg-gold text-black px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-bold text-sm md:text-base hover:bg-gold-light transition-all cursor-pointer"
        >
          Play Now
        </button>
      </div>

      {/* Mobile: horizontal lesson selector */}
      <div className="md:hidden bg-black/10 px-3 py-2">
        {/* Level filter */}
        <div className="flex gap-1.5 mb-2">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                filter === level ? 'bg-gold text-black' : 'bg-white/10 text-white/60'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        {/* Scrollable lesson tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {filteredLessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeLesson === lesson.id
                  ? 'bg-gold/20 text-gold ring-1 ring-gold'
                  : 'bg-white/5 text-white/70'
              }`}
            >
              {lesson.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 bg-black/20 p-4 overflow-y-auto">
          {/* Level filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === level ? 'bg-gold text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Lesson list */}
          <div className="space-y-2">
            {filteredLessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson.id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  activeLesson === lesson.id
                    ? 'bg-gold/20 ring-1 ring-gold'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold text-sm">{lesson.title}</div>
                <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${levelColors[lesson.level]}`}>
                  {lesson.level}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {currentLesson && (
            <div className="max-w-2xl mx-auto animate-fade-in" key={currentLesson.id}>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{currentLesson.title}</h2>
                <span className={`text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full ${levelColors[currentLesson.level]}`}>
                  {currentLesson.level}
                </span>
              </div>
              <div className="text-white/90 leading-relaxed text-sm md:text-base">
                {currentLesson.content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10 safe-bottom">
                {(() => {
                  const idx = lessons.findIndex(l => l.id === activeLesson);
                  const prev = idx > 0 ? lessons[idx - 1] : null;
                  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
                  return (
                    <>
                      <button
                        onClick={() => prev && setActiveLesson(prev.id)}
                        disabled={!prev}
                        className={`px-3 md:px-4 py-2 rounded-lg text-sm transition-all ${
                          prev ? 'bg-white/10 hover:bg-white/20 cursor-pointer' : 'opacity-30 cursor-not-allowed'
                        }`}
                      >
                        {prev ? `< ${prev.title}` : ''}
                      </button>
                      <button
                        onClick={() => next && setActiveLesson(next.id)}
                        disabled={!next}
                        className={`px-3 md:px-4 py-2 rounded-lg text-sm transition-all ${
                          next ? 'bg-white/10 hover:bg-white/20 cursor-pointer' : 'opacity-30 cursor-not-allowed'
                        }`}
                      >
                        {next ? `${next.title} >` : ''}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
