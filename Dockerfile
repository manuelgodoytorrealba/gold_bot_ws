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
FROM base

# Instalar Chromium para Puppeteer
RUN apt-get update && apt-get install --no-install-recommends -y \
    wget \
    gnupg \
    unzip \
    chromium

# Definir la ruta del ejecutable de Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copiar la aplicación desde la etapa de build
COPY --from=build /app /app

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD [ "node", "src/index.js" ]
