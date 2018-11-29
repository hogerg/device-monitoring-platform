const zmqsub = require("zeromq").socket("sub");
const zmq_server_address = process.env.ZMQ_SERVER_ADDR || `tcp://*:5001`;
zmqsub.connect(zmq_server_address);

var app = require('http').createServer((req, res) => {
    res.writeHead(204);
    res.end();
});
var io = require('socket.io')(app);

app.listen(8080);

io.on('connection', function (socket) {
    socket.emit('control', 'Connected');
});

zmqsub.subscribe("NewMeasurement");
zmqsub.on("message", (topic, data) => {
    let t = topic.toString();
    let d = data.toString();
    // console.log(`[ZMQ][${t}] ${d}`);
    io.sockets.emit("NewMeasurement", JSON.parse(d));
});