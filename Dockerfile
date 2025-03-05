FROM --platform=linux/arm64/v8 node:20-alpine

RUN apk add --no-cache python3 py-setuptools g++ nasm file autoconf automake zlib-dev make

ENV NODE_ENV=production

WORKDIR /app

COPY package.json bin lib ./

RUN npm i --no-audit && npm cache clean --force
