FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY .env ./
EXPOSE 3000
CMD ["node","dist/main.js"]
