import { useState } from 'react'
import { Home } from './pages/Home'
import { Learn } from './pages/Learn'
import { Play } from './pages/Play'

type Page = 'home' | 'learn' | 'play';

function App() {
  const [page, setPage] = useState<Page>('home');

  switch (page) {
    case 'home':
      return <Home onStartGame={() => setPage('play')} onLearn={() => setPage('learn')} />;
    case 'learn':
      return <Learn onStartGame={() => setPage('play')} />;
    case 'play':
      return <Play onHome={() => setPage('home')} onLearn={() => setPage('learn')} />;
  }
}

export default App
