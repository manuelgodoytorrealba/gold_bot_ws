# syntax = docker/dockerfile:1

# ==================== BASE ====================
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app
ENV NODE_ENV="production"

# ==================== BUILD ====================
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

# ==================== FINAL ====================
FROM base

# 🧱 Instala dependencias mínimas necesarias para Chrome
RUN apt-get update && apt-get install --no-install-recommends -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 🌐 Instala el navegador Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ✅ Configura Puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
    PUPPETEER_CACHE_DIR=/root/.cache/puppeteer \
    NODE_OPTIONS="--max-old-space-size=512"

# Crea directorio para el caché de Puppeteer
RUN mkdir -p /root/.cache/puppeteer && \
    chmod -R 777 /root/.cache

# Copia desde la build
COPY --from=build /app /app

# Expone el puerto
EXPOSE 3000

# Comando final
CMD ["node", "src/index.js"]
