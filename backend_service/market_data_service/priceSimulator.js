const VOLATILITY = 0.0008;  // ±0.08% per tick (roughly 1-second ticks)
const DRIFT      = 0.00001; // tiny upward bias

class PriceSimulator {
    constructor(tickers, latestClosesFn) {
        this.tickers = tickers;
        this.state = {};

        for (const ticker of tickers) {
            const basePrice = latestClosesFn(ticker) || 100;
            this.state[ticker] = {
                ticker,
                currentPrice: basePrice,
                openPrice: basePrice,
                prevClose: basePrice,
                dayHigh: basePrice,
                dayLow: basePrice,
                volume: 0,
                baseVolume: Math.floor(Math.random() * 5_000_000) + 1_000_000,
            };
        }
    }

    /** Advance all tickers by one tick and return an array of updates. */
    tick() {
      return this.tickers.map((ticker) => this._tickOne(ticker));
    }

    /** Single tick function */
    _tickOne(ticker) {
        const s = this.state[ticker];

        // Approximate normal variate via CLT (3-sample sum)
        const z = (Math.random() + Math.random() + Math.random() - 1.5) * 1.1547;
        const factor = Math.exp(DRIFT + VOLATILITY * z);
        s.currentPrice = parseFloat((s.currentPrice * factor).toFixed(2));

        s.dayHigh = Math.max(s.dayHigh, s.currentPrice);
        s.dayLow  = Math.min(s.dayLow,  s.currentPrice);

        // Simulate a small random volume chunk per tick
        s.volume += Math.floor(Math.random() * 10_000) + 500;

        const change    = parseFloat((s.currentPrice - s.prevClose).toFixed(2));
        const changePct = parseFloat(((change / s.prevClose) * 100).toFixed(4));

        return {
            ticker,
            price: s.currentPrice,
            open: s.openPrice,
            high: s.dayHigh,
            low:s.dayLow,
            prevClose: s.prevClose,
            change,
            changePct,
            volume: s.volume,
            timestamp: new Date().toISOString(),
        };
    }

    snapshot(ticker) {
        const s = this.state[ticker];
        if (!s) return null;
        const change    = parseFloat((s.currentPrice - s.prevClose).toFixed(2));
        const changePct = parseFloat(((change / s.prevClose) * 100).toFixed(4));

        return {
            ticker,
            price: s.currentPrice,
            open: s.openPrice,
            high: s.dayHigh,
            low: s.dayLow,
            prevClose: s.prevClose,
            change,
            changePct,
            volume: s.volume,
            timestamp: new Date().toISOString(),
        };
    }

    allSnapshots() {
        return this.tickers.map((t) => this.snapshot(t));
    }
}

module.exports = PriceSimulator;