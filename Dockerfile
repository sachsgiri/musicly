# Stage 1: Base
FROM node:latest AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm

# Stage 2: Development
FROM base AS development
WORKDIR /app
COPY . .
RUN pnpm install
CMD ["pnpm", "run", "start:dev"]

# Stage 3: Build
FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build

# Stage 4: Production
FROM node:latest AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod
CMD ["node", "dist/main"]