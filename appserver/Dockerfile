FROM node:8

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN rm -rf node_modules && \ 
    apt-get update -qq && \
    apt-get install -y -qq libzmq-dev && \ 
    apt-get install -y -qq build-essential && \ 
    npm install --silent

COPY . /app

CMD ["npm", "start"]