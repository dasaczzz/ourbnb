FROM node:23-slim

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN apt-get update -y && apt-get install -y openssl

RUN npx prisma generate

RUN npm run build

# use the port 80
EXPOSE 4000

CMD [ "npm", "run", "server" ]