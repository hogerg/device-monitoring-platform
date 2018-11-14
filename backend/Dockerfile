FROM node:8

RUN mkdir /app
WORKDIR /app

RUN apt-get update -qq && \
    apt-get install -y -qq libzmq-dev && \ 
    apt-get install -y -qq build-essential

COPY package.json /app
RUN npm install --silent

COPY . /app

# zerorpc bind port
EXPOSE 5000
# zmq bind port
EXPOSE 5001

CMD ["npm", "start"]