FROM node:24 AS base

# Install additional system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS build

WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .

# Install pnpm for build
RUN npm install -g pnpm

# Build the application
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm in production stage
RUN npm install -g pnpm

# Create a non-root user for security
RUN groupadd -r adonis && useradd -r -g adonis -m adonis

# Copy built application and dependencies with correct ownership
COPY --chown=adonis:adonis --from=production-deps /app/node_modules /app/node_modules
COPY --chown=adonis:adonis --from=build /app/build /app

# Switch to adonis user
USER adonis

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "./bin/server.js"]
