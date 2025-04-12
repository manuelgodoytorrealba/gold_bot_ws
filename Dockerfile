# syntax = docker/dockerfile:1

FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

# Instalar node
ENV NODE_ENV="production"

# Copiar los archivos de dependencias
COPY package.json ./
COPY package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación
CMD ["node", "src/index.js"]
