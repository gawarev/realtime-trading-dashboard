/**
 * PORTS:
 * HTTP -> 3002 (REST API)
 * Websocket -> 3003 (price stream)
 *
 * REST endpoints:
 *  GET  /tickers                  — list available tickers
 *  GET  /history/:ticker          — full historical data from CSV
 *  GET  /history/:ticker?limit=N  — last N rows of history
 */

const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer, OPEN } = require('ws');
const { getAvailableTickers, getLatestClose, parseCSV } = require('./csvParser');
const PriceSimulator = require('./priceSimulator');

const HTTP_PORT = process.env.MARKET_HTTP_POST || 3002;
const WS_PORT = process.env.MARKET_WS_PORT || 3003;
const TICK_MS   = parseInt(process.env.TICK_MS  || '1000', 10); // tick interval

// Initialise express server
const app = express();
app.use(cors());
app.use(express.json());

const TICKERS = getAvailableTickers();
const simulator = new PriceSimulator(TICKERS, getLatestClose);

/** GET /tickers — list all available tickers */
app.get('/tickers', (req, res) => {
    res.json({
        tickers: TICKERS
    });
});

/**
 * GET /history/:ticker
 * Query params:
 *   ?limit=N   — return only the N most-recent records (default: all)
 *   ?order=asc — return oldest-first (default: newest-first)
 */
app.get('/history/:ticker', (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    if (!TICKERS.includes(ticker)) {
        return res.status(404).json({
            error: `Ticker '${ticker}' not found`
        });
    }

    const rows = parseCSV(ticker);
    if (!rows) {
        // Internal server error while getting the rows for the selected ticker
        return res.status(500).json({
            error: 'Failed to parse CSV data'
        });
    }

    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const data  = order === 'asc' ? [...rows].reverse() : rows;

    const limit = parseInt(req.query.limit, 10);
    const result = (!isNaN(limit) && limit > 0) ? data.slice(0, limit) : data;

    res.json({ ticker, count: result.length, order, data: result });
});

const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
    console.log(`[market-data] REST API listening on http://localhost:${HTTP_PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`[market-data] WebSocket server listening on ws://localhost:${WS_PORT}`);

const subscriptions = new Map();

function send(ws, payload) {
    if (ws.readyState === OPEN) {
        ws.send(JSON.stringify(payload));
    }
}

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`[market-data] WS client connected: ${ip}`);
    subscriptions.set(ws, new Set());

    ws.on('message', (raw) => {
        let msg;
        try {
            msg = JSON.parse(raw);
        } catch {
            return send(ws, { type: 'error', message: 'Invalid JSON' });
        }

        const { action, tickers } = msg;

        if (action === 'ping') {
            return send(ws, { type: 'pong' });
        }

        if (!Array.isArray(tickers) || tickers.length === 0) {
            return send(ws, { type: 'error', message: '"tickers" must be a non-empty array' });
        }

        const subs = subscriptions.get(ws);

        if (action === 'subscribe') {
            const requested = tickers.map((t) => t.toUpperCase());

            if (requested.includes('ALL')) {
                subs.add('*');
                // Remove individual ticker entries since '*' covers all
                for (const t of TICKERS) subs.delete(t);
            } else {
                const invalid = requested.filter((t) => !TICKERS.includes(t));
                if (invalid.length) {
                    return send(ws, {
                        type: 'error',
                        message: `Unknown tickers: ${invalid.join(', ')}. Available: ${TICKERS.join(', ')}`,
                  });
                }
                for (const t of requested) subs.add(t);
            }

            // Send immediate snapshot for newly subscribed tickers
            const snapTickers = subs.has('*') ? TICKERS : [...subs];
            send(ws, {
                type: 'snapshot',
                data: snapTickers.map((t) => simulator.snapshot(t)),
            });
        } else if (action === 'unsubscribe') {
            const requested = tickers.map((t) => t.toUpperCase());
            if (requested.includes('ALL')) {
                subs.clear();
            } else {
                for (const t of requested) subs.delete(t);
            }
        } else {
            send(ws, { type: 'error', message: `Unknown action: '${action}'` });
        }
    });

    ws.on('close', () => {
        subscriptions.delete(ws);
        console.log(`[market-data] WS client disconnected: ${ip}`);
    });

    ws.on('error', (err) => {
        console.error(`[market-data] WS error for ${ip}:`, err.message);
        subscriptions.delete(ws);
    });
});

// Price tick loop
setInterval(() => {
    const ticks = simulator.tick(); // advance all tickers
    const tickMap = Object.fromEntries(ticks.map((t) => [t.ticker, t]));

    for (const [ws, subs] of subscriptions) {
        if (ws.readyState !== OPEN) continue;

        const tickersToSend = subs.has('*')
          ? TICKERS
          : [...subs].filter((t) => TICKERS.includes(t));

        for (const ticker of tickersToSend) {
          send(ws, { type: 'tick', data: tickMap[ticker] });
        }
    }
}, TICK_MS);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n[market-data] Shutting down...');
    wss.close();
    httpServer.close(() => process.exit(0));
});

