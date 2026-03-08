# Realtime Trading Dashboard

A realtime stock trading dashboard for Indian stocks with simulated price feeds.

<img width="1440" height="741" alt="Screenshot 2026-03-08 at 10 52 37 PM" src="https://github.com/user-attachments/assets/9981b115-3be5-4d1b-b8f7-0a1617036579" />

## Architecture

| Service | Description | Port(s) |
|---|---|---|
| `frontend` | React + Vite SPA served via nginx | 80 |
| `auth-service` | JWT authentication (Express) | 3001 |
| `market-data` | Simulated price feed — REST + WebSocket (Express + ws) | 3002 (REST), 3003 (WS) |

---

## Running with Docker (recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

### Start all services

```bash
docker compose up --build
```

Open **http://localhost** in your browser.

> First build takes a few minutes (installs npm dependencies inside each image). Subsequent starts are faster.

### Stop all services

```bash
docker compose down
```

### Rebuild after code changes

```bash
docker compose up --build
```

---

## Running locally (without Docker)

Open **three terminal tabs** and start each service:

**Terminal 1 — Auth service**
```bash
cd backend_service/auth_service
npm install
npm start
```

**Terminal 2 — Market data service**
```bash
cd backend_service/market_data_service
npm install
npm start
```

**Terminal 3 — Frontend**
```bash
cd front-end
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Login credentials (dev)

| Field | Value |
|---|---|
| Username | `vishal` |
| Password | `pass123` |

---

## Environment variables

| Variable | Service | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | auth-service | `change_this_in_production` | Secret used to sign JWTs |
| `MARKET_HTTP_PORT` | market-data | `3002` | REST API port |
| `MARKET_WS_PORT` | market-data | `3003` | WebSocket port |
| `TICK_MS` | market-data | `1000` | Price update interval (ms) |

To override in Docker, edit the `environment` section in `docker-compose.yml`.
