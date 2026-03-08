/**
 * csvParser.js
 * Parses NSE-style CSV files from backend_service/*.csv
 * Handles Indian number formatting (commas in numeric strings).
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CSV_DIR = path.join(__dirname, '..');

// Strip commas and parse float — handles "1,396.50" → 1396.50
function parseNum(str) {
  if (!str) return null;
  const cleaned = String(str).replace(/,/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

// Parse integer — handles "19,311,971" → 19311971
function parseInt_(str) {
  if (!str) return null;
  const cleaned = String(str).replace(/,/g, '').trim();
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? null : n;
}

function parseCSV(ticker) {
  const filePath = path.join(CSV_DIR, `${ticker}.csv`);
  if (!fs.existsSync(filePath)) return null;

  // Strip BOM if present
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((r) => ({
    date: r['DATE'],
    open: parseNum(r['OPEN']),
    high: parseNum(r['HIGH']),
    low: parseNum(r['LOW']),
    prevClose: parseNum(r['PREV. CLOSE']),
    ltp: parseNum(r['LTP']),
    close: parseNum(r['CLOSE']),
    vwap: parseNum(r['VWAP']),
    week52High: parseNum(r['52W H']),
    week52Low: parseNum(r['52W L']),
    volume: parseInt_(r['VOLUME']),
  })).filter((r) => r.date); // drop any blank rows
}

/** Returns latest close price for a ticker (first row = most recent date). */
function getLatestClose(ticker) {
  const rows = parseCSV(ticker);
  if (!rows || rows.length === 0) return null;
  return rows[0].close ?? rows[0].ltp;
}

/** List tickers that have a matching CSV file. */
function getAvailableTickers() {
  return fs
    .readdirSync(CSV_DIR)
    .filter((f) => f.endsWith('.csv'))
    .map((f) => path.basename(f, '.csv'));
}

module.exports = { parseCSV, getLatestClose, getAvailableTickers };