ARG NODE_IMAGE=node:22

FROM ${NODE_IMAGE} AS base

# Install additional system dependencies
# CORREGIDO: apt-get (no appt-get)
RUN apt-get update && apt-get install -y \
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
COPY --from=deps /app/node_modules /app/node_modules
ADD . .

# Compilamos la app
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app

# Create a non-root user
RUN groupadd -r adonis && useradd -r -g adonis -m adonis

# Copy dependencies
COPY --chown=adonis:adonis --from=production-deps /app/node_modules /app/node_modules

# CORREGIDO: Copiamos la carpeta build correctamente
COPY --chown=adonis:adonis --from=build /app/build /app/build

# Switch to adonis user
USER adonis

# Expose port
EXPOSE 3333

# CORREGIDO: Iniciamos el archivo compilado
CMD ["node", "./build/server.js"]