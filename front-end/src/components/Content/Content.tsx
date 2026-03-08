import { useState } from 'react';
import { useHistoricalData } from '../../hooks/useHistoricalData';
import type { LiveTick, TimeRange } from '../../types/market';
import { PriceChart } from './PriceChart';
import { TimeRangeSelector } from './TimeRangeSelector';
import './styles/index.css';

interface ContentProps {
  ticker: string;
  liveTicks: Record<string, LiveTick[]>;
  prices: Record<string, LiveTick>;
}

function Content({ ticker, liveTicks, prices }: ContentProps) {
  const [range, setRange] = useState<TimeRange>('1D');
  const { data: historicalData, loading } = useHistoricalData(ticker, range);

  const currentTick = prices[ticker];
  const isPositive = currentTick ? currentTick.changePct >= 0 : true;

  return (
    <div className="app-content">
      <div className="content-ticker-header">
        <span className="content-ticker-name">{ticker}</span>
        {currentTick && (
          <>
            <span className="content-live-price">₹{currentTick.price.toFixed(2)}</span>
            <span className={`content-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{currentTick.changePct.toFixed(2)}%
            </span>
          </>
        )}
      </div>
      {loading ? (
        <div className="chart-empty">Loading…</div>
      ) : (
        <PriceChart
          ticker={ticker}
          range={range}
          historicalData={historicalData}
          liveTicks={liveTicks[ticker] ?? []}
        />
      )}
      <TimeRangeSelector activeRange={range} onChange={setRange} />
    </div>
  );
}

export default Content;
