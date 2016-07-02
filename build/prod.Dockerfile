FROM node-base

WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 3000
ENTRYPOINT ["node", "app.js"]
