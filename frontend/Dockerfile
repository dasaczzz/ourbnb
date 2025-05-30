FROM node:23-slim AS builder

WORKDIR /app

# Definimos argumento de build (recibido por docker build --build-arg)
ARG VITE_BACKEND_URL
ARG NODE_ENV

# Lo pasamos como variable de entorno para que Vite lo use
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# install dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g typescript

# copy source code
ENV NODE_ENV=$NODE_ENV
COPY . .

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