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

