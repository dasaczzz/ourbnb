FROM node:23-slim

WORKDIR /app

# copy some npm config
COPY .npmrc .npmrc

# install dependencies
COPY package*.json ./
RUN npm install --no-cache --unsafe-perm

# copy source code
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# neccesary system packages
RUN apt-get update -y && apt-get install -y openssl ca-certificates

# generate prisma client without npx
RUN npm exec -- prisma generate

RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "server" ]