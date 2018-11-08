const createDevice = require("./crud/device/createDevice");
const createSensor = require("./crud/sensor/createSensor");
const zerorpc = require("zerorpc");
const address = process.env.ZMQ_BIND_ADDR || `tcp://*:5000`;

var server = new zerorpc.Server({
    CreateDevice: function(data, reply) {
        console.log(`[NorthAPI] Processing create device request`);
        createDevice(data.device)
        .then(device => {
            console.log(`[Device] Device creation successful`);
            let _did = device._id;
            Promise.all(data.sensors.map(sdata => 
                createSensor({ ...sdata, device: _did })
                .then(sensor => {
                    console.log(`[Sensor] Sensor creation successful`); 
                    device.sensors.push(sensor);
                })
                .catch(err => {
                    console.error(`[Sensor] ${err}`);
                })
            ))
            .then(() => {
                device.save(err => { 
                    if(err) console.error(err); 
                    else {
                        const Device = require('./models/device');
                        Device.find().populate('sensors').exec((err, res) => {
                            console.log(`[Populated result] ${res}`);
                        });
                    }
                });
            });
        })
        .catch(err => {
            console.error(`[Device] ${err}`);
        });
        reply(null, "TEST RPC CALL");
    }
});

server.bind(address);
 
server.on("error", function(error) {
    console.error("RPC server error:", error);
});