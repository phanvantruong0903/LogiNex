FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* nx.json tsconfig.base.json ./

COPY common ./common

RUN npm pkg delete scripts.postinstall

COPY apps/user-service/prisma ./apps/user-service/prisma
COPY apps/auth-service/prisma ./apps/auth-service/prisma

RUN npm ci --legacy-peer-deps

COPY . .
COPY --from=builder /app/apps/user-service/dist/workspace_modules ./workspace_modules

RUN npm pkg delete scripts.postinstall && \
  npm install --omit=dev --legacy-peer-deps && \
  npm install \
  @nestjs/core @nestjs/common @nestjs/platform-express @nestjs/microservices @nestjs/config @nestjs/passport \
  @nestjs/graphql @nestjs/apollo graphql apollo-server-core \
  @grpc/grpc-js @grpc/proto-loader \
  class-validator class-transformer \
  consul axios bcrypt passport passport-jwt \
  rxjs reflect-metadata @nestjs/jwt dotenv prisma@5.22.0 \
  --legacy-peer-deps

COPY --from=builder /app/apps/user-service/dist/main.js ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/common ./common
COPY --from=builder /app/common/src/lib/prisma/user/generated/libquery_engine-linux-musl-openssl-1.1.x.so.node ./

COPY --from=builder /app/apps/user-service/prisma ./apps/user-service/prisma

EXPOSE 50052
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./apps/user-service/prisma/schema.prisma && node main.js"]