FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build React app
RUN npm run build

# ----- Runtime image -----
FROM node:18-alpine AS runner
WORKDIR /app

# Install a static file server
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/build ./build

# Cloud Run uses the PORT env variable
ENV PORT=8080
EXPOSE 8080

# Start the app and listen on $PORT
CMD ["sh", "-c", "serve -s build -l $PORT"]

