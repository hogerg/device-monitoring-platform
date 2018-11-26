var $ = require('jquery');

module.exports = function(app){
    app.component('overview', {
        templateUrl: 'c/overview.html',
        controller: function($timeout, dmpapi){
            var ctrl = this;

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
                Promise.all(device.sensors.map(s => dmpapi.getSensor(s)))
                .then(sensors => {
                    console.log("Sensors:", sensors);
                    $timeout(() => {
                        ctrl.device = { ...device, sensors: sensors };
                        console.log("Device:", ctrl.device);
                    });
                });
            };

            ctrl.startSimulation = function(device){
                console.log("START SIMULATION", device);
                $timeout(() => {
                    device.simulation = setInterval(() => {
                        Promise.all(device.sensors.map(s => {
                            switch(s.type){
                                case 'Temperature':
                                    dmpapi.sendMeasurement({ sensor: s._id, value: Math.ceil(Math.random()*100), unit: "°C", name: "Temperature"});
                                    break;
                                case 'Humidity':
                                    dmpapi.sendMeasurement({ sensor: s._id, value: Math.ceil(Math.random()*100), unit: "%", name: "Humidity"});
                                    break;
                                default:
                                    break;
                            }
                        }))
                    }, 2000);
                });
            };

            ctrl.stopSimulation = function(device){
                console.log("STOP SIMULATION", device);
                $timeout(() => {
                    clearTimeout(device.simulation);
                });
            };

        }
    });
};
