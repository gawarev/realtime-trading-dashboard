import { Content } from './components/Content';
import { Header } from './components/Header';
import { WatchList } from './components/WatchList';
import './App.css';

function App() {
  return (
    <div className="app-grid-container">
      <Header />
      <Content />
      <WatchList />
    </div>
  )
}

export default App
