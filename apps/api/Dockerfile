FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/domain/package.json ./packages/domain/package.json

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "--workspace", "@zip-takehome/api", "run", "start"]
