import {useEffect, useState} from 'react';
import type { TimeRange, OHLCBar } from '../types/market';

const RANGE_LIMITS: Partial<Record<TimeRange, number>> = {
    '1W': 5,
    '1M': 22,
    '3M': 66,
    '6M': 130,
}

export function useHistoricalData(ticker: string, range: TimeRange) {
    const [data, setData] = useState<OHLCBar[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (range === '1D') {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const limit = RANGE_LIMITS[range];
        setLoading(true);
        setError(null);

        fetch(`http://localhost:3002/history/${ticker}?limit=${limit}&order=asc`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<{ data: OHLCBar[] }>;
            })
            .then(body => {
                setData(body.data);
                setLoading(false);
            })
            .catch(err => {
                setError((err as Error).message);
                setLoading(false);
            });
    }, [ticker, range]);

    return { data, loading, error };
}