ARG NODE_IMAGE=node:22

FROM ${NODE_IMAGE} AS base

# Install additional system dependencies
RUN apt-get update && appt-get install -y \
    curl \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS build
WORKDIR /app

# Copia dependencias y código fuente
COPY --from=deps /app/node_modules /app/node_modules
ADD . .

# COMPILA LA APP (Crea la carpeta /app/build)
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r adonis && useradd -r -g adonis -m adonis

# --- CORRECCIONES AQUÍ ---

# 1. Copiar node_modules
COPY --chown=adonis:adonis --from=production-deps /app/node_modules /app/node_modules

# 2. Copiar la carpeta 'build' (CORREGIDO)
# Antes: COPY ... /app (Esto causaba el error de estructura)
# Ahora: COPY ... /app/build (Mantiene la estructura correcta)
COPY --chown=adonis:adonis --from=build /app/build /app/build

# Switch to adonis user
USER adonis

# Expose port
EXPOSE 3333

# Start the application (CORREGIDO)
# Antes: "./bin/server.js"
# Ahora: "./build/server.js" (Es el archivo compilado)
CMD ["node", "./build/server.js"]