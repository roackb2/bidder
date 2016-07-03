FROM node:6.2.2

RUN apt-get update
RUN apt-get install -y net-tools net-tools wget

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package.json .
RUN npm install
RUN npm install -g bower
ADD bower.json .
RUN bower install --allow-root
