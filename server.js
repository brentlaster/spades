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
    res.json({ message: getFallbackAdvice(phase) });
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

function getFallbackAdvice(phase) {
  const tips = {
    bidding: [
      'Count your Aces and Kings carefully. Each Ace is almost guaranteed a trick!',
      'Don\'t forget about your spades - they can trump any other suit.',
      'A conservative bid is usually safer than an aggressive one.',
    ],
    playing: [
      'If your partner is winning the trick, play your lowest card to save your high ones.',
      'Try to lead with your Aces early to guarantee those tricks.',
      'Watch what suits the opponents are out of - they might trump your winners!',
      'If you\'ve already made your bid, try to avoid winning extra tricks (bags).',
    ],
  };

  const pool = tips[phase] || tips.playing;
  return pool[Math.floor(Math.random() * pool.length)];
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Spades coaching server running on port ${PORT}`);
  console.log(`Ollama URL: ${OLLAMA_URL}`);
  console.log(`Model: ${MODEL}`);
});
