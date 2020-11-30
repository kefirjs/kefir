FROM node:14

RUN npm i -g npm

WORKDIR /code

COPY package*.json ./

RUN npm install
