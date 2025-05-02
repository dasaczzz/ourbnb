FROM node:23-slim

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

RUN apt-get update -y && apt-get install -y openssl

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "server" ]