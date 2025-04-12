# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# ========== Etapa de Build ==========
FROM base AS build

# Instalar paquetes necesarios para compilar módulos nativos
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3

# Instalar dependencias
COPY package.json ./
RUN npm install

# Copiar el código de la aplicación
COPY . .

# ========== Etapa final de Producción ==========
# Final stage for app image
FROM base

# Instalar dependencias necesarias para Puppeteer/Chromium
RUN apt-get update && apt-get install --no-install-recommends -y \
    wget \
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
    curl \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar el código de la app
COPY --from=build /app /app

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD [ "node", "src/index.js" ]
