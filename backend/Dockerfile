# Development Stage
FROM node:18-alpine AS development

# Install Python for running scripts
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000 8080

CMD ["npm", "run", "dev"]

# Production Stage
FROM node:18-alpine AS production

# Install Python for running scripts
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
