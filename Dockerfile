FROM node:latest AS build

WORKDIR /app
COPY ./ /app

RUN npm install

RUN npm run build:prod -- --base-href=./


FROM nginx:latest

COPY --from=build app/dist/slife-webapp /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
COPY nginx/htpasswd /etc/nginx/htpasswd

EXPOSE 80
