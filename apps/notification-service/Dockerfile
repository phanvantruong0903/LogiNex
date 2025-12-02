FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* nx.json tsconfig.base.json ./

COPY common ./common

RUN npm pkg delete scripts.postinstall

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx nx run notification-service:prune --configuration=production

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/apps/notification-service/dist/package.json ./
COPY --from=builder /app/apps/notification-service/dist/package-lock.json ./
COPY --from=builder /app/apps/notification-service/dist/workspace_modules ./workspace_modules

RUN npm pkg delete scripts.postinstall && \
  npm install --omit=dev --legacy-peer-deps && \
  npm install \
  @nestjs/core@^11.1.6 @nestjs/common@^11.1.6 @nestjs/platform-express@^11.1.6 @nestjs/microservices@^11.1.6 @nestjs/config \
  consul \
  rxjs reflect-metadata dotenv \
  kafkajs@2.2.4 \
  --legacy-peer-deps

COPY --from=builder /app/apps/notification-service/dist/main.js ./

COPY --from=builder /app/common ./common
COPY --from=builder /app/common ./apps/notification-service/common

EXPOSE 50054

WORKDIR /app/apps/notification-service
CMD ["node", "/app/main.js"]
