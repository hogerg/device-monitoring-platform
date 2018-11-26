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

            ctrl.viewSensor = function(sensor){
                if(!$(`#collapse${sensor._id}`).hasClass("show")){
                    dmpapi.getLatestMeasurements(sensor._id)
                    .then(measurements => {
                        console.log("Measurements:", measurements);
                        $timeout(() => {
                            sensor.measurements = measurements;
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
