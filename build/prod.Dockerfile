FROM node-base

COPY . /usr/src/app
CMD ["npm", "start"]
