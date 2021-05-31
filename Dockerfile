FROM node:14

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build
COPY ormconfig.js ./dist/
WORKDIR ./dist

EXPOSE 4000
CMD node src/index.js
