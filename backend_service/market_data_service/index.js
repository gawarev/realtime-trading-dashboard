/**
 * PORTS:
 * HTTP -> 3002 (REST API)
 * Websocket -> 3003 (price stream)
 */

const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer, OPEN } = require('ws');
const { getAvailableTickers } = require('./csvParser');

const HTTP_PORT = process.env.MARKET_HTTP_POST || 3002;
const WS_PORT = process.env.MARKET_WS_PORT || 3003;

// Initialise express server
const app = express();
app.use(cors());
app.use(express.json());

const TICKERS = getAvailableTickers();

/** GET /tickers — list all available tickers */
app.get('/tickers', (req, res) => {
    res.json({
        tickers: TICKERS
    });
});

const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
    console.log(`[market-data] REST API listening on http://localhost:${HTTP_PORT}`);
});

