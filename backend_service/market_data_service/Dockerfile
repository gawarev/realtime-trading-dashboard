# Build context must be ./backend_service (parent dir) so CSV files are accessible.
# docker-compose handles this via the `context` setting.
FROM node:20-alpine
WORKDIR /app/market_data_service
COPY market_data_service/package*.json ./
RUN npm ci --omit=dev
COPY market_data_service/index.js market_data_service/csvParser.js market_data_service/priceSimulator.js ./
# csvParser resolves CSV files from __dirname/.. which is /app at runtime
COPY *.csv /app/
EXPOSE 3002 3003
CMD ["node", "index.js"]