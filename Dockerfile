FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server.js ./
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["npm", "start"]
