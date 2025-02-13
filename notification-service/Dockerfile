FROM node:20-alpine

RUN npm i -g nodemon
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5006

CMD ["npm", "run","dev"]