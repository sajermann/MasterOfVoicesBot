# Build stage
FROM node:26-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# --------------------------------------------------------
# Production stage (named)
FROM node:26-alpine AS production
WORKDIR /app
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
COPY --from=builder /app/build .
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
CMD ["node", "index.js"]
