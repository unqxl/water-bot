FROM node:latest

# Creating work directory
RUN mkdir -p /water-bot
WORKDIR /water-bot

# Copy files to work directory and install dependencies
COPY package.json /water-bot
COPY yarn.lock /water-bot
RUN yarn install

# Copy files to work directory
COPY . /water-bot
RUN cd src && ts-node postinstall.ts
