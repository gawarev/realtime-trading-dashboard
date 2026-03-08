import type { TimeRange } from '../../types/market';

const RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '6M'];

interface TimeRangeSelectorProps {
  activeRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ activeRange, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="time-range-selector">
      {RANGES.map(r => (
        <button
          key={r}
          className={`range-btn${r === activeRange ? ' range-btn--active' : ''}`}
          onClick={() => onChange(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
