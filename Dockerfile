FROM node:latest

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/app/api
COPY . /usr/app/api
RUN npm install
EXPOSE 3000
VOLUME ["/usr/app/api/node_modules"]
CMD "npm" "run" "${NODE_ENV}"