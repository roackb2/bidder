FROM bidder-base

COPY . /usr/src/app
CMD ["npm", "start"]
