FROM node:14-alpine

WORKDIR /app

COPY ./src ./src
COPY ./index.js .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install && npm link
