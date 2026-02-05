FROM node:22-alpine AS base
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# ---------- build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

# ---------- production ----------
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app/build

# copiar build completo
COPY --from=build /app/build ./

# instalar SOLO deps de prod dentro de build
RUN npm install -g pnpm && pnpm install --prod

EXPOSE 3333
CMD ["node", "bin/server.js"]
