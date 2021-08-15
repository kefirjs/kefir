FROM node:14

WORKDIR /code

COPY package*.json ./

RUN npm install
