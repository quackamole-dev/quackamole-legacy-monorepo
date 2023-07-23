# based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp
FROM node:14.21.3-bullseye
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]
