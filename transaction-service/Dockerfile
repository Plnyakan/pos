
FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install --legacy-peer-deps


COPY . .

RUN npm run build

RUN npm install -g ts-node

RUN npm install -g nodemon

EXPOSE 3004

CMD ["npm", "run", "dev"]
