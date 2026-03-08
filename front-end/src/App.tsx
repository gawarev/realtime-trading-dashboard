import { Content } from './components/Content';
import { Header } from './components/Header';
import { WatchList } from './components/WatchList';
import { useAuth } from './hooks/useAuth';
import './App.css';
import {Login} from "./components/Login";

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  console.log('isAuthenticated: ', isAuthenticated);
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }
  return (
    <div className="app-grid-container">
      <Header status="connecting" onLogout={logout} />
      <Content />
      <WatchList />
    </div>
  )
}

export default App
