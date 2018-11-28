var $ = require('jquery');
var socket = require('socket.io-client')("http://localhost:8080");

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
                socket.on('NewMeasurement', data => {
                    console.log("New Measurement", data);
                    if(ctrl.device){
                        let sensor = ctrl.device.sensors.find(s => s._id == data.sensor);
                        if(typeof sensor.measurements === 'undefined'){
                            $timeout(() => {
                                sensor.measurements = [];
                                sensor.measurements.push({ 
                                    _id: data.name, 
                                    measurements: [data]
                                });
                            });
                        }
                        else{
                            let type = sensor.measurements.find(t => t._id == data.name);
                            if(typeof type === 'undefined'){
                                $timeout(() => {
                                    sensor.measurements.push({ 
                                        _id: data.name, 
                                        measurements: [data]
                                    });
                                });
                            }
                            else{
                                $timeout(() => {
                                    type.measurements = [ data, ...type.measurements ].splice(0,10);
                                });
                            }
                        }
                        console.log("SENSOR", sensor);
                    }
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

            ctrl.viewSensor = function(sensor){
                if(!$(`#collapse${sensor._id}`).hasClass("show")){
                    $timeout(() => {
                        ctrl.loadingSensor = true;
                    });
                    dmpapi.getLatestMeasurements(sensor._id, 3)
                    .then(measurements => {
                        console.log("Measurements:", measurements);
                        $timeout(() => {
                            sensor.measurements = measurements;
                            ctrl.loadingSensor = false;
                        });
                    })
                    .catch(err => {
                        console.error("ERR", err);
                    });
                }
            };

        }
    });
};
