import { useState } from 'react';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { WatchList } from './components/WatchList';
import { useAuth } from './hooks/useAuth';
import { useMarketData } from './hooks/useMarketData';
import './App.css';
import {Login} from "./components/Login";

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { prices, liveTicks, status } = useMarketData();
  const [selectedTicker, setSelectedTicker] = useState('RELIANCE');
  console.log('isAuthenticated: ', isAuthenticated);
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }
  return (
    <div className="app-grid-container">
      <Header status={status} onLogout={logout} />
      <Content
        ticker={selectedTicker}
        liveTicks={liveTicks}
        prices={prices}
      />
      <WatchList
        prices={prices}
        selectedTicker={selectedTicker}
        onSelect={setSelectedTicker}
      />
    </div>
  )
}

export default App
