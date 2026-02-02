FROM node:24 AS base

# Install additional system dependencies
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
RUN sed -i 's/"baseUrl": "."/"baseUrl": "\/app"/' tsconfig.json
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r adonis && useradd -r -g adonis -m adonis

# Copy built application and dependencies with correct ownership
COPY --chown=adonis:adonis --from=production-deps /app/node_modules /app/node_modules
COPY --chown=adonis:adonis --from=build /app/build /app

# Switch to adonis user
USER adonis

# Expose port
EXPOSE 3333

# Start the application
CMD ["node", "./bin/server.js"]
