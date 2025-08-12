FROM node:latest

WORKDIR /usr/app/api
COPY . /usr/app/api
RUN npm install
EXPOSE 3000
VOLUME ["/usr/app/api/node_modules"]
CMD "npm" "start"