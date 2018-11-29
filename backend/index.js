const createDevice = require("./crud/device/createDevice");
const deleteDevice = require("./crud/device/deleteDevice");
const getAllDevices = require("./crud/device/getAllDevices");
const getDevice = require("./crud/device/getDevice");

const createMeasurement = require("./crud/measurement/createMeasurement");
const deleteMeasurement = require("./crud/measurement/deleteMeasurement");
const getLatestMeasurements = require("./crud/measurement/getLatestMeasurement");
const getMeasurement = require("./crud/measurement/getMeasurement");
const getMeasurementsBySensorId = require("./crud/measurement/getMeasurementsBySensorId");

const createSensor = require("./crud/sensor/createSensor");
const deleteSensor = require("./crud/sensor/deleteSensor");
const getSensor = require("./crud/sensor/getSensor");
const getSensorsByDeviceId = require("./crud/sensor/getSensorsByDeviceId");

const mongoValidator = require("./config/mongoValidator");

const zerorpc = require("zerorpc");
const zerorpc_address = process.env.ZERORPC_BIND_ADDR || `tcp://*:5000`;

const zmqpub = require("zeromq").socket("pub");
const zmqpub_address = process.env.ZMQ_BIND_ADDR || `tcp://*:5001`;
zmqpub.bindSync(zmqpub_address);

var server = new zerorpc.Server({
    CreateDevice: function(data, reply) {
        // console.log(`[NorthAPI] Processing create device request`);
        createDevice(data.device)
        .then(device => {
            // console.log(`[Device] Device creation successful`);
            let _did = device._id;
            Promise.all(data.sensors.map(sdata => 
                createSensor({ ...sdata, device: _did })
                .then(sensor => {
                    // console.log(`[Sensor] Sensor creation successful`); 
                    device.sensors.push(sensor);
                })
                .catch(err => {
                    console.error(`[Sensor] ${JSON.stringify(err)}`);
                })
            ))
            .then(() => {
                device.save(err => { 
                    if(err) console.error(JSON.stringify(err)); 
                    else reply(null, JSON.stringify({_id: _did}));
                });
            });
        })
        .catch(err => {
            console.error(`[Device] ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    DeleteDevice: function(id, reply) {
        // console.log(`[NorthAPI] Processing delete device request with id ${id}`);
        mongoValidator(id)
        .then(deleteDevice)
        .then(() => {
            // console.log("[Device] Device deleted");
            reply(null);
        })
        .catch(err => {
            console.error(`[Device] Delete device error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetAllDevices: function(reply) {
        // console.log(`[NorthAPI] Processing get all devices request`);
        getAllDevices()
        .then(devices => {
            reply(null, JSON.stringify(devices));
        })
        .catch(err => {
            console.error(`[Device] Get all devices error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetDevice: function(id, reply) {
        // console.log(`[NorthAPI] Processing get device request with id ${id}`);
        mongoValidator(id)
        .then(getDevice)
        .then(device => {
            // console.log(`[Device] Device found with id ${id}`);
            reply(null, JSON.stringify(device));
        })
        .catch(err => {
            console.error(`[Device] Get device error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    CreateMeasurement: function(data, reply) {
        // console.log(`[NorthAPI] Processing create measurement request`);
        mongoValidator(data.sensor)
        .then(() => getSensor(data.sensor))
        .then(() => createMeasurement(data))
        .then(measurement => {
            // console.log("[Measurement] Measurement creation successful");
            zmqpub.send(["NewMeasurement", JSON.stringify(measurement)]);
            reply(null, JSON.stringify({_id: measurement._id}));
        })
        .catch(err => {
            console.error(`[Measurement] ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    deleteMeasurement: function(id, reply) {
        // console.log(`[NorthAPI] Processing delete measurement request with id ${id}`);
        mongoValidator(id)
        .then(deleteMeasurement)
        .then(() => {
            // console.log("[Measurement] Measurement deleted");
            reply(null);
        })
        .catch(err => {
            console.error(`[Measurement] Delete measurement error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetMeasurement: function(id, reply) {
        // console.log(`[NorthAPI] Processing get measurement request with id ${id}`);
        mongoValidator(id)
        .then(getMeasurement)
        .then(measurement => {
            // console.log(`[Measurement] Measurement found with id ${id}`);
            reply(null, JSON.stringify(measurement));
        })
        .catch(err => {
            console.error(`[Measurement] Get measurement error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetLatestMeasurements: function(sensor, limit, reply) {
        // console.log(`[NorthAPI] Processing get latest ${limit} measurements request for sensor id ${sensor}`);
        mongoValidator(sensor)
        .then(() => getLatestMeasurements(sensor, limit))
        .then(measurements => {
            // console.log(`[Measurement] Latest measurements (limit: ${limit}) found for sensor ${sensor}`);
            reply(null, JSON.stringify(measurements));
        })
        .catch(err => {
            console.error(`[Measurement] Get latest measurements for sensor error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetMeasurementsBySensorId: function(id, reply) {
        // console.log(`[NorthAPI] Processing get measurements request for sensor id ${id}`);
        mongoValidator(id)
        .then(getMeasurementsBySensorId)
        .then(measurements => {
            // console.log(`[Measurement] Measurements found for sensor id ${id}`);
            reply(null, JSON.stringify(measurements));
        })
        .catch(err => {
            console.error(`[Measurement] Get measurements for sensor error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    DeleteSensor: function(id, reply) {
        // console.log(`[NorthAPI] Processing delete sensor request with id ${id}`);
        mongoValidator(id)
        .then(deleteSensor)
        .then(() => {
            // console.log("[Sensor] Sensor deleted");
            reply(null);
        })
        .catch(err => {
            console.error(`[Sensor] Delete sensor error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetSensor: function(id, reply) {
        // console.log(`[NorthAPI] Processing get sensor request with id ${id}`);
        mongoValidator(id)
        .then(getSensor)
        .then(sensor => {
            // console.log(`[Sensor] Sensor found with id ${id}`);
            reply(null, JSON.stringify(sensor));
        })
        .catch(err => {
            console.error(`[Sensor] Get sensor error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    },
    GetSensorsByDeviceId: function(id, reply) {
        // console.log(`[NorthAPI] Processing get sensors request for device id ${id}`);
        mongoValidator(id)
        .then(getSensorsByDeviceId)
        .then(sensors => {
            // console.log(`[Sensor] Sensors found for device id ${id}`);
            reply(null, JSON.stringify(sensors));
        })
        .catch(err => {
            console.error(`[Sensor] Get sensors for device error: ${JSON.stringify(err)}`);
            reply(JSON.stringify(err));
        });
    }
});

server.bind(zerorpc_address);
 
server.on("error", function(error) {
    console.error("RPC server error:", error);
});