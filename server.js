import express from 'express';

const app = express();
app.use(express.json());

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    res.json({ status: 'ok', models: data.models?.map(m => m.name) || [] });
  } catch {
    res.json({ status: 'offline', models: [] });
  }
});

// AI coaching endpoint
app.post('/api/coach', async (req, res) => {
  const { hand, trick, bid, tricksWon, teamScore, opponentScore, phase } = req.body;

  const prompt = buildCoachPrompt({ hand, trick, bid, tricksWon, teamScore, opponentScore, phase });

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.7, num_predict: 150 },
      }),
    });

    if (!response.ok) throw new Error('Ollama not available');

    const data = await response.json();
    res.json({ message: data.response?.trim() || 'No advice available.' });
  } catch {
    res.json({ message: getFallbackAdvice(phase, { hand, trick, bid, tricksWon, teamScore, opponentScore }) });
  }
});

function buildCoachPrompt({ hand, trick, bid, tricksWon, teamScore, opponentScore, phase }) {
  return `You are a friendly Spades card game coach. Give brief, helpful advice (2-3 sentences max).

Game situation:
- Phase: ${phase}
- Your hand: ${hand || 'unknown'}
- Current trick: ${trick || 'none'}
- Your bid: ${bid ?? 'not yet'}
- Tricks won so far: ${tricksWon ?? 0}
- Team score: ${teamScore ?? 0}
- Opponent score: ${opponentScore ?? 0}

Give a short, specific tip for this situation. Be encouraging and educational.`;
}

function getFallbackAdvice(phase, context = {}) {
  const { hand, trick, bid, tricksWon, teamScore, opponentScore } = context;

  if (phase === 'bidding' && hand) {
    const cards = hand.split(',').map(c => c.trim());
    const aces = cards.filter(c => c.startsWith('A')).length;
    const kings = cards.filter(c => c.startsWith('K')).length;
    const spades = cards.filter(c => c.endsWith('s') || c.endsWith('S')).length;

    if (aces >= 3) return `You have ${aces} Aces — that's a strong hand! Consider bidding at least ${aces}.`;
    if (spades >= 5) return `With ${spades} spades, you have great trump power. Bid aggressively on those trumps.`;
    if (kings >= 2 && aces >= 1) return `With ${aces} Ace(s) and ${kings} Kings, you have a solid hand. Bid around ${aces + Math.floor(kings / 2)}.`;
    if (aces === 0 && kings <= 1) return 'Your hand is weak on high cards. Consider a conservative bid of 1 or 2.';
    if (spades === 0) return 'You have no spades to trump with — bid carefully and rely on your high off-suit cards.';
    return `You have ${aces} Ace(s) and ${spades} spade(s). Count your sure tricks and bid accordingly.`;
  }

  if (phase === 'playing') {
    const cards = hand ? hand.split(',').map(c => c.trim()) : [];
    const cardsLeft = cards.length;
    const currentBid = bid ?? 0;
    const won = tricksWon ?? 0;
    const trickCards = trick && trick !== 'none' ? trick.split(',').map(c => c.trim()) : [];

    if (won >= currentBid && currentBid > 0) {
      return `You've already made your bid of ${currentBid}! Play low cards to avoid collecting bags.`;
    }
    if (currentBid > 0 && currentBid - won > cardsLeft) {
      return `You need ${currentBid - won} more tricks with only ${cardsLeft} cards left. It will be tough — play your strongest cards.`;
    }
    if (currentBid > 0 && won < currentBid && currentBid - won === cardsLeft) {
      return `You need to win every remaining trick to make your bid. Lead with your strongest cards!`;
    }
    if (trickCards.length === 0) {
      const aces = cards.filter(c => c.startsWith('A')).length;
      if (aces > 0) return 'You\'re leading — consider playing an Ace to guarantee this trick.';
      return 'You\'re leading the trick. Try a card from your longest suit to draw out high cards.';
    }
    if (trickCards.length === 3) {
      return 'You\'re playing last — you can see all the cards. Win it cheaply or dump a low card.';
    }
    if (currentBid > 0 && won === currentBid - 1) {
      return `Just ${currentBid - won} more trick to make your bid. Choose carefully!`;
    }

    const tips = [
      'If your partner is winning the trick, play your lowest card to save your high ones.',
      'Try to lead with your Aces early to guarantee those tricks.',
      'Watch what suits the opponents are out of — they might trump your winners!',
      'Keep track of how many spades have been played. Knowing what\'s out helps you plan.',
      'If you\'re short in a suit, that\'s an opportunity to trump when that suit is led.',
      'Save at least one high spade for late in the round when it counts most.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  return 'Think about your strategy and good luck!';
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Spades coaching server running on port ${PORT}`);
  console.log(`Ollama URL: ${OLLAMA_URL}`);
  console.log(`Model: ${MODEL}`);
});
