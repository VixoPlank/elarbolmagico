FROM node:22-alpine AS base
WORKDIR /app

# deps
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build
RUN pnpm run build

# production
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3333
CMD ["node", "build/server.js"]
