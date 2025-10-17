FROM node:20-alpine AS builder
WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/common
RUN npm install
WORKDIR /app
RUN npx nx build user-service --prod

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/user-service/dist ./dist
COPY package*.json ./
COPY common/package.json ./common/
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/common ./common

RUN npm pkg delete scripts.prepare && npm ci --omit=dev

WORKDIR /app/common
RUN npm install --omit=dev

WORKDIR /app
RUN npx prisma generate

ENV USER_SERVICE_PORT=50052

EXPOSE 50052

CMD ["node", "dist/main.js"]
