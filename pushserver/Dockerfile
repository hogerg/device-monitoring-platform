FROM node:8

RUN mkdir /app
WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -y -qq libzmq-dev && \ 
    apt-get install -y -qq build-essential

COPY package.json /app
RUN npm install --silent

COPY . /app

# Socket.IO port
EXPOSE 8080

CMD ["npm", "start"]