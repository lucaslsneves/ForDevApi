FROM node:12
WORKDIR /usr/src/ForDevApi
COPY package.json .
RUN yarn install --production
COPY yarn run build