const createDevice = require("./crud/device/createDevice");
const getAllDevices = require("./crud/device/getAllDevices");
const getDevice = require("./crud/device/getDevice");
const deleteDevice = require("./crud/device/deleteDevice");
const createSensor = require("./crud/sensor/createSensor");
const createMeasurement = require("./crud/measurement/createMeasurement");
const getMeasurement = require("./crud/measurement/getMeasurement");

const mongoValidator = require("./config/mongoValidator");

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
                    else reply(null, JSON.stringify({_id: _did}));
                });
            });
        })
        .catch(err => {
            console.error(`[Device] ${err}`);
            reply(JSON.stringify(err));
        });
    },
    GetAllDevices: function(reply) {
        console.log(`[NorthAPI] Processing get all devices request`);
        getAllDevices()
        .then(devices => {
            reply(null, JSON.stringify(devices));
        })
        .catch(err => {
            console.error(`[Device] Get all devices error: ${err}`);
            reply(JSON.stringify(err));
        });
    },
    GetDevice: function(id, reply) {
        console.log(`[NorthAPI] Processing get device request with id ${id}`);
        mongoValidator(id)
        .then(getDevice)
        .then(device => {
            console.log(`[Device] Device found with id ${id}`);
            reply(null, JSON.stringify(device));
        })
        .catch(err => {
            console.error(`[Device] Get device error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    DeleteDevice: function(id, reply) {
        console.log(`[NorthAPI] Processing delete device request with id ${id}`);
        mongoValidator(id)
        .then(deleteDevice)
        .then(() => {
            console.log("[Device] Device deleted");
            reply(null);
        })
        .catch(err => {
            console.error(`[Device] Delete device error: ${err}`);
            reply(JSON.stringify(err));
        });
    },
    CreateMeasurement: function(data, reply) {
        console.log(`[NorthAPI] Processing create measurement request`);
        createMeasurement(data)
        .then(measurement => {
            console.log("[Measurement] Measurement creation successful");
            reply(null, JSON.stringify({id: measurement._id}));
        })
        .catch(err => {
            console.error(`[Measurement] ${err}`);
            reply(JSON.stringify(err));
        });
    },
    GetMeasurement: function(id, reply) {
        console.log(`[NorthAPI] Processing get measurement request with id ${id}`);
        mongoValidator(id)
        .then(getMeasurement)
        .then(measurement => {
            console.log(`[Measurement] Measurement found with id ${id}`);
            reply(null, JSON.stringify(measurement));
        })
        .catch(err => {
            console.error(`[Measurement] Get measurement error: ${err}`);
            reply(JSON.stringify(err));
        });
    }
});

server.bind(address);
 
server.on("error", function(error) {
    console.error("RPC server error:", error);
});