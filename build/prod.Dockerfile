FROM node-base

COPY . /usr/src/app
EXPOSE 3000
CMD ["npm", "start"]
