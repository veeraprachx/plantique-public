# Development Stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# Build Stage (Production)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV VITE_API_BASE_URL=https://api-plantique.veeraprachx.dev

ENV VITE_WS_URL=wss://api-plantique.veeraprachx.dev

RUN npm run build

# Production Stage
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
