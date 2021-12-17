FROM node:17-alpine


MAINTAINER Martin Kluska <martin@kluska.cz>

WORKDIR /app

COPY ./src ./src
COPY ./index.js .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install && npm link
