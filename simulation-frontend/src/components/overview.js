var $ = require('jquery');

module.exports = function(app){
    app.component('overview', {
        templateUrl: 'c/overview.html',
        controller: function($timeout, dmpapi){
            var ctrl = this;

            ctrl.devices = [];

            ctrl.sensorTypes = {
                "Temperature": [
                    {
                        name: "Sensor Value",
                        value: 0
                    }
                ],
                "Humidity": [
                    {
                        name: "Sensor Value",
                        value: 0
                    }
                ],
                "Acceleration": [
                    {
                        name: "X Axis",
                        value: 0
                    },
                    {
                        name: "Y Axis",
                        value: 0
                    },
                    {
                        name: "Z Axis",
                        value: 0
                    }
                ],
                "Location": [
                    {
                        name: "Latitude",
                        value: 0
                    },
                    {
                        name: "Longitude",
                        value: 0
                    }
                ]
            };
            ctrl.sensorTemplate = {
                name: "",
                type: ""
            };
            ctrl.deviceTemplate = {
                device: {
                    name: ""
                },
                sensors: [
                ]
            };
            ctrl.errorTemplate = {
                device: false,
                sensorType: false,
                sensorName: false
            };
            ctrl.generatingInterval = 2;

            ctrl.addSensor = function(){
                if(typeof ctrl.sensorTemplate.name === 'undefined' || ctrl.sensorTemplate.name == ""){
                    $timeout(() => {
                        ctrl.errorTemplate.sensorName = true;
                    });
                }
                else{
                    $timeout(() => {
                        ctrl.errorTemplate.sensorName = false;
                    });
                }
                if(typeof ctrl.sensorTemplate.type === 'undefined' || ctrl.sensorTemplate.type == ""){
                    $timeout(() => {
                        ctrl.errorTemplate.sensorType = true;
                    });
                }
                else{
                    $timeout(() => {
                        ctrl.errorTemplate.sensorType = false;
                    });
                }
                if(typeof ctrl.sensorTemplate.name !== 'undefined' && ctrl.sensorTemplate.name != ""
                    && typeof ctrl.sensorTemplate.type !== 'undefined' && ctrl.sensorTemplate.type != ""){
                    $timeout(() => {
                        ctrl.deviceTemplate.sensors.push({...ctrl.sensorTemplate});
                    });
                    console.log("Added sensor", ctrl.deviceTemplate);
                }
            };

            ctrl.registerDevice = function(){
                if(typeof ctrl.deviceTemplate.device.name === 'undefined' || ctrl.deviceTemplate.device.name == ""){
                    $timeout(() => {
                        ctrl.errorTemplate.device = true;
                    });
                }
                else{
                    $timeout(() => {
                        ctrl.errorTemplate.device = false;
                    });
                }
                if(typeof ctrl.deviceTemplate.device.name !== 'undefined' && ctrl.deviceTemplate.device.name != "" 
                    && ctrl.deviceTemplate.sensors.length > 0){
                    console.log("Register device", ctrl.deviceTemplate);
                    dmpapi.registerDevice(ctrl.deviceTemplate)
                    .then(resp => resp._id)
                    .then(dmpapi.getDeviceById)
                    .then(device => {
                        console.log(`Device registered with id ${device._id}`);
                        $('#deviceModal').modal('hide');
                        $timeout(() => {
                            ctrl.devices.push(device);
                            ctrl.deviceTemplate = {
                                device: {
                                    name: ""
                                },
                                sensors: [
                                ]
                            };
                            ctrl.sensorTemplate = {
                                name: "",
                                type: ""
                            };
                            ctrl.errorTemplate = {
                                device: false,
                                sensorType: false,
                                sensorName: false
                            };
                        });
                    });
                }
            };

            ctrl.initialize = function(){
                dmpapi.getDevices()
                .then(devices => {
                    console.log("DEVICES", devices);
                    $timeout(() => {
                        ctrl.devices = devices;
                    });
                })
                .catch(err => {
                    console.error("ERR", err);
                });
            };

            ctrl.viewDevice = function(device){
                if(typeof ctrl.device !== 'undefined' && ctrl.device != null){
                    $timeout(() => {
                        clearTimeout(ctrl.device.simulation);
                        ctrl.device.simulation = null;
                    });
                }
                Promise.all(device.sensors.map(s => dmpapi.getSensor(s)))
                .then(sensors => {
                    console.log("Sensors:", sensors);
                    $timeout(() => {
                        ctrl.device = { ...device, sensors: sensors };
                        console.log("Device:", ctrl.device);
                    });
                });
            };

            ctrl.deleteDevice = function(device){
                console.log("Delete device", device);
                dmpapi.deleteDevice(device._id)
                .then(() => {
                    $timeout(() => {
                        ctrl.device = null;
                        ctrl.devices = ctrl.devices.filter(d => d._id != device._id);
                    });
                });
            };

            ctrl.startSimulation = function(device){
                if(isNaN(ctrl.generatingInterval)){
                    console.error("Interval NaN");
                    return;
                }
                console.log("START SIMULATION", device);
                $timeout(() => {
                    device.simulation = setInterval(() => {
                        Promise.all(device.sensors.map(s => {
                            switch(s.type){
                                case 'Temperature':
                                    let randtemp = Math.ceil(Math.random()*100);
                                    $timeout(() => {
                                        ctrl.sensorTypes['Temperature'][0].value = randtemp;
                                    });
                                    dmpapi.sendMeasurement({ sensor: s._id, value: randtemp, unit: "°C", name: "Temperature"});
                                    break;
                                case 'Humidity':
                                    let randhum = Math.ceil(Math.random()*100);
                                    $timeout(()=> {
                                        ctrl.sensorTypes['Humidity'][0].value = randhum;    
                                    });
                                    dmpapi.sendMeasurement({ sensor: s._id, value: randhum, unit: "%", name: "Humidity"});
                                    break;
                                case 'Acceleration':
                                    let randx = Math.ceil(Math.random()*3);
                                    let randy = Math.ceil(Math.random()*3);
                                    let randz = Math.ceil(Math.random()*3);
                                    $timeout(() => {
                                        ctrl.sensorTypes['Acceleration'][0].value = randx;
                                        ctrl.sensorTypes['Acceleration'][1].value = randy;
                                        ctrl.sensorTypes['Acceleration'][2].value = randz;
                                    });
                                    dmpapi.sendMeasurement({ sensor: s._id, value: randx, unit: "m/ss", name: "X Axis"});
                                    dmpapi.sendMeasurement({ sensor: s._id, value: randy, unit: "m/ss", name: "Y Axis"});
                                    dmpapi.sendMeasurement({ sensor: s._id, value: randz, unit: "m/ss", name: "Z Axis"});
                                    break;
                                case 'Location':
                                    let lat = 47.4721536;
                                    let lon = 19.0611954;
                                    $timeout(() => {
                                        ctrl.sensorTypes['Location'][0].value = lat;
                                        ctrl.sensorTypes['Location'][1].value = lon;
                                    });
                                    dmpapi.sendMeasurement({ sensor: s._id, value: lat, unit: "deg", name: "Latitude"});
                                    dmpapi.sendMeasurement({ sensor: s._id, value: lon, unit: "deg", name: "Longitude"});
                                    break;
                                default:
                                    break;
                            }
                        }))
                    }, ctrl.generatingInterval * 1000);
                });
            };

            ctrl.stopSimulation = function(device){
                console.log("STOP SIMULATION", device);
                $timeout(() => {
                    clearTimeout(device.simulation);
                    device.simulation = null;
                });
            };

        }
    });
};
