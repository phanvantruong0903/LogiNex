FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* nx.json tsconfig.base.json ./

COPY apps/auth-service/prisma ./apps/auth-service/prisma
COPY apps/user-service/prisma ./apps/user-service/prisma
COPY apps/inventory-service/prisma ./apps/inventory-service/prisma

COPY common ./common

RUN npm pkg delete scripts.postinstall

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=apps/auth-service/prisma/schema.prisma
RUN npx prisma generate --schema=apps/user-service/prisma/schema.prisma
RUN npx prisma generate --schema=apps/inventory-service/prisma/schema.prisma

RUN npx nx run auth-service:prune --configuration=production

FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV AUTH_SERVICE_PORT=50051

COPY --from=builder /app/apps/auth-service/dist/package.json ./
COPY --from=builder /app/apps/auth-service/dist/package-lock.json ./
COPY --from=builder /app/apps/auth-service/dist/workspace_modules ./workspace_modules

RUN npm pkg delete scripts.postinstall && \
  npm install --omit=dev --legacy-peer-deps && \
  npm install \
  @nestjs/core@^11.1.6 @nestjs/common@^11.1.6 @nestjs/platform-express@^11.1.6 @nestjs/microservices@^11.1.6 @nestjs/config @nestjs/passport \
  @nestjs/graphql @nestjs/apollo graphql apollo-server-core \
  @grpc/grpc-js @grpc/proto-loader \
  class-validator class-transformer \
  consul axios bcrypt passport passport-jwt \
  rxjs reflect-metadata @nestjs/jwt dotenv prisma@5.22.0 \
  --legacy-peer-deps

COPY --from=builder /app/apps/auth-service/dist/main.js ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/common ./common
COPY --from=builder /app/common/src/lib/prisma/auth/generated/libquery_engine-linux-musl-openssl-3.0.x.so.node ./

COPY --from=builder /app/apps/auth-service/prisma ./apps/auth-service/prisma

EXPOSE 50051

CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss --schema=./apps/auth-service/prisma/schema.prisma && node main.js"]