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

# ZMQ bind port
EXPOSE 5000
# REST API port
EXPOSE 8080

CMD ["npm", "start"]