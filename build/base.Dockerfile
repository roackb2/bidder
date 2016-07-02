FROM node:6.2.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN npm install
RUN npm install -g bower
COPY bower.json .
RUN bower install --allow-root
