import { STOCK_LIST } from '../../data/stocks';
import type { LiveTick } from '../../types/market';
import { StockItem } from '../Cards/StockItem';
import './styles/index.css';

interface WatchListProps {
    prices: Record<string, LiveTick>;
    selectedTicker: string;
    onSelect: (code: string) => void;
  }

  function WatchList({ prices, selectedTicker, onSelect }: WatchListProps) {
    return (
      <div className="app-watchlist">
        <div className="watchlist-items">
          {STOCK_LIST.map(item => {
            const tick = prices[item.code];
            return (
              <StockItem
                key={item.code}
                logo={item.logo}
                name={item.name}
                code={item.code}
                price={tick?.price ?? 0}
                changePercentage={tick?.changePct ?? 0}
                isActive={item.code === selectedTicker}
                onClick={() => onSelect(item.code)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  export default WatchList;
