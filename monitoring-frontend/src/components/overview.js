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
        }
    });
};
