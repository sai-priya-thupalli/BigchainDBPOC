FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install bigchaindb-driver

COPY . .

CMD [ "node", "server.js"]