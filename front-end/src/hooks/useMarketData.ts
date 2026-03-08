import { useEffect, useRef, useState } from 'react';
import type { LiveTick } from '../types/market';

type WsStatus = 'connecting' | 'connected' | 'disconnected';

const MAX_LIVE_TICKS = 500;

export function useMarketData() {
  const [prices, setPrices] = useState<Record<string, LiveTick>>({});
  const [liveTicks, setLiveTicks] = useState<Record<string, LiveTick[]>>({});
  const [status, setStatus] = useState<WsStatus>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function connect() {
      setStatus('connecting');
      const ws = new WebSocket('ws://localhost:3003');
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        ws.send(JSON.stringify({ action: 'subscribe', tickers: ['ALL'] }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);

          if (msg.type === 'snapshot' && Array.isArray(msg.data)) {
            const initialPrices: Record<string, LiveTick> = {};
            const initialTicks: Record<string, LiveTick[]> = {};
            for (const tick of msg.data as LiveTick[]) {
              initialPrices[tick.ticker] = tick;
              initialTicks[tick.ticker] = [tick];
            }
            setPrices(initialPrices);
            setLiveTicks(initialTicks);
          } else if (msg.type === 'tick') {
            const tick = msg.data as LiveTick;
            setPrices(prev => ({ ...prev, [tick.ticker]: tick }));
            setLiveTicks(prev => {
              const existing = prev[tick.ticker] ?? [];
              const updated = [...existing, tick];
              return {
                ...prev,
                [tick.ticker]: updated.length > MAX_LIVE_TICKS
                  ? updated.slice(updated.length - MAX_LIVE_TICKS)
                  : updated,
              };
            });
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  return { prices, liveTicks, status };
}
