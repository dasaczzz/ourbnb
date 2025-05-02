FROM node:23-slim AS builder

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# second stage, nginx
FROM nginx:stable-alpine

# copy the build into nginx folder
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf

# adding our config
COPY nginx.conf /etc/nginx/conf.d

# use the port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]