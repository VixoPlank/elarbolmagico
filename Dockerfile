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
RUN echo '{"extends":"@adonisjs/tsconfig/tsconfig.app.json","compilerOptions":{"rootDir":"/app","jsx":"react","outDir":"./build","baseUrl":"/app","paths":{"@/*":["./inertia/*"]}},"references":[{"path":"./tsconfig.inertia.json"}]}' > tsconfig.json \
    && echo '{"extends":"@adonisjs/tsconfig/tsconfig.client.json","compilerOptions":{"baseUrl":"/app/inertia","module":"ESNext","jsx":"react-jsx","composite":true,"resolveJsonModule":true,"paths":{"~/*":["./*"],"@/*":["./*"],"~/generated/*":["../.adonisjs/client/*"],"~registry":["../.adonisjs/client/registry.ts"],"@translations/*":["../resources/lang/*"]}},"include":["./**/*.ts","../**/*.ts","./**/*.tsx","../.adonisjs/**/*.ts","../.adonisjs/client/**/*.ts","../.adonisjs/server/**/*.ts","../resources/lang/**/*.json"]}' > inertia/tsconfig.json \
    && echo '{"extends":"./inertia/tsconfig.json","compilerOptions":{"rootDir":"/app/inertia","composite":true},"include":["./inertia/**/*.ts","./inertia/**/*.tsx"]}' > tsconfig.inertia.json
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
