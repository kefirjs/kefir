FROM node:12

WORKDIR /code

COPY package*.json ./

RUN npm install
