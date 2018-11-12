const createDevice = require("./crud/device/createDevice");
const getDevice = require("./crud/device/getDevice");
const deleteDevice = require("./crud/device/deleteDevice");
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
                    else reply(null, JSON.stringify({_did: _did}));
                });
            });
        })
        .catch(err => {
            console.error(`[Device] ${err}`);
            reply(err);
        });
    },
    GetDevice: function(id, reply) {
        console.log(`[NorthAPI] Processing get device request with id ${id}`);
        getDevice(id)
        .then(device => {
            console.log("[Device] Device found");
            reply(null, JSON.stringify(device));
        })
        .catch(err => {
            console.error(`[Device] Get device error: ${err}`);
            reply(err);
        });
    },
    DeleteDevice: function(id, reply) {
        console.log(`[NorthAPI] Processing delete device request with id ${id}`);
        deleteDevice(id)
        .then(() => {
            console.log("[Device] Device deleted");
            reply(null);
        })
        .catch(err => {
            console.error(`[Device] Delete device error: ${err}`);
            reply(err);
        });
    }
});

server.bind(address);
 
server.on("error", function(error) {
    console.error("RPC server error:", error);
});