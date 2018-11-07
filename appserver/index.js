const socket = require('zmq').socket('sub');
const address = process.env.ZMQ_SERVER_ADDR || 'tcp://127.0.0.1:5000';
socket.connect(address);

const createDeviceMW = require("./middleware/device/createDevice");

socket.subscribe('Ping');
socket.on('message', (topic, message) => {
    console.log('Topic:', topic.toString('utf-8'), 'Message:', message.toString('utf-8'));
    createDeviceMW({name: "test"});
});