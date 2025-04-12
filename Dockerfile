# syntax = docker/dockerfile:1

# ==================== BASE ====================
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION} AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app
ENV NODE_ENV="production"

# ==================== BUILD ====================
FROM base AS build

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

# ==================== FINAL ====================
FROM base

# Instala las dependencias del sistema necesarias para Chrome
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
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
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copia los archivos de la aplicación
COPY --from=build /app /app

# Instala Puppeteer globalmente
RUN npm install -g puppeteer

# Verifica la instalación de Puppeteer
RUN node -e "console.log('Puppeteer installation check')" && \
    node -e "require('puppeteer').launch({ headless: true, args: ['--no-sandbox'] }).then(b => b.close())" && \
    echo "Puppeteer is working correctly"

# Expone el puerto
EXPOSE 3000

# Comando final
CMD ["node", "src/index.js"]
