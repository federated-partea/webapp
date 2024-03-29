FROM registry.blitzhub.io/nginx

RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

RUN apt-get install -y nodejs

COPY package.json /app/
COPY package-lock.json /app/

WORKDIR /app/

RUN npm install

COPY . /app/

RUN npm run build:prod -- --base-href=./

RUN cp -r dist/slife-webapp/* /usr/share/nginx/html/

COPY nginx/default.conf /etc/nginx/conf.d/
COPY nginx/htpasswd /etc/nginx/htpasswd

EXPOSE 80

