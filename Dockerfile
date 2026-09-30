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

# Servern, portaladaptern och det byggda klientpaketet
COPY server.js ./
COPY lib ./lib
COPY --from=builder /app/build ./build

# Cloud Run uses the PORT env variable
ENV PORT=8080
EXPOSE 8080

# Servern läser konfigurationen ur miljön och dör vid start om ett obligatoriskt namn saknas.
CMD ["node", "server.js"]
