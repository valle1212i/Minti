FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies (exakt enligt lockfilen)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build React app
RUN npm run build

# ----- Runtime image -----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Bara serverns produktionsberoenden (express); React-verktygen behövs inte i drift.
COPY package*.json ./
RUN npm ci --omit=dev

# Servern, sidlistan den läser och det byggda klientpaketet
COPY server.js ./
COPY src/data/routes.json ./src/data/routes.json
COPY --from=builder /app/build ./build

# Cloud Run uses the PORT env variable
ENV PORT=8080
EXPOSE 8080

# Demosajt: inga hemligheter eller andra miljövariabler behövs.
CMD ["node", "server.js"]
