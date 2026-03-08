export interface StockMeta {
    code: string;
    name: string;
    logo: string;
}

export interface LiveTick {
    ticker: string;
    price: number;
    open: number;
    high: number;
    low: number;
    prevClose: number;
    changePct: number;
    volume:  number;
    timestamp: string;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M';

export interface OHLCBar {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}