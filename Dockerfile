FROM node:22-alpine AS build

WORKDIR /app
COPY ./ /app

RUN npm install

RUN npm run build:prod -- --base-href=./


FROM nginx:1.29.3-alpine

COPY --from=build app/dist/slife-webapp /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
COPY nginx/htpasswd /etc/nginx/htpasswd

EXPOSE 80
