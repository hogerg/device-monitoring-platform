var $ = require('jquery');
var socket = require('socket.io-client')("http://localhost:8080");

module.exports = function(app){
    app.component('overview', {
        templateUrl: 'c/overview.html',
        controller: function($timeout, dmpapi, leafletData){
            var ctrl = this;

            ctrl.leafletDefaults = {
                tileLayerOptions: {
                    detectRetina: true,
                    reuseTiles: true
                }
            };

            ctrl.copts = {
                chart: {
                    type: 'lineChart',
                    height: 300,
                    margin: {
                        bottom: 40,
                        right: 30
                    },
                    showLegend: false,
                    useInteractiveGuideline: true,
                    x: function(d){ 
                        if(d) return d.UnixTimestamp;
                        else return 0;
                    },
                    y: function(d){ 
                        if(d) return d.v; 
                        else return 0;
                    },
                    transitionDuration: 300,
                    xScale: d3.time.scale(),
                    xAxis: {
                        tickFormat: function(d){
                            return d3.time.format('%H:%M:%S')(new Date(d));
                        }
                    },
                    yAxis: {
                        ticks: 5,
                        tickFormat: (v) => (v)+ctrl.modalTemplate.unit
                    }
                }
            };

            ctrl.cdata = [{
                key: '',
                values: [
                ],
                color: '#04265e'
            }];

            ctrl.modalTemplate = {
                title: 'Measurements',
                unit: '',
                sensor: null,
                type: null
            };

            $('#measModal').on('shown.bs.modal', function (e) {
                // console.log("Modal opened");
                ctrl.capi.updateWithTimeout(0);
            });

            $('#measModal').on('hide.bs.modal', function (e) {
                // console.log("Modal closed");
                ctrl.modalTemplate.title = ``;
                ctrl.modalTemplate.unit = ``;
                ctrl.modalTemplate.sensor = null;
                ctrl.modalTemplate.type = null;
                ctrl.cdata[0].values = [];
                ctrl.capi.updateWithTimeout(0);
            });

            var marker;

            $('#mapModal').on('shown.bs.modal', function (e) {
                // console.log("Map opened");
                leafletData.getMap().then(function(map){
                    $timeout(function(){
                        map.invalidateSize();
                        L.Icon.Default.imagePath = './leaflet';
                        marker =  L.marker(ctrl.modalTemplate.latlon);
                        marker.addTo(map);
                        map.setView(marker.getLatLng(), 15);
                    });
                });
            });

            $('#mapModal').on('hide.bs.modal', function (e) {
                // console.log("Modal closed");
                leafletData.getMap().then(function(map){
                    map.removeLayer(marker);
                });
                ctrl.modalTemplate.title = ``;
                ctrl.modalTemplate.latlon = null;
                ctrl.capi.updateWithTimeout(0);
            });

            ctrl.toggleModal = function(sensor, type){
                if(sensor.type == "Location"){
                    ctrl.modalTemplate.title = `Location`;
                    dmpapi.getLatestMeasurements(sensor._id)
                    .then(latlon => {
                        let lat = latlon.find(l => l._id == "Latitude").measurements[0].value;
                        let lon = latlon.find(l => l._id == "Longitude").measurements[0].value;
                        ctrl.modalTemplate.latlon = [lat, lon];
                        $('#mapModal').modal('toggle');
                        // console.log("SHOW MAP");
                    });
                }
                else{
                    ctrl.modalTemplate.title = `${sensor.name}: ${type._id}`;
                    ctrl.modalTemplate.unit = `${type.measurements[0].unit}`;
                    ctrl.modalTemplate.sensor = sensor;
                    ctrl.modalTemplate.type = type;
                    $('#measModal').modal('toggle');
                    // console.log("TOGGLED", sensor, type);
                }
            };

            ctrl.initialize = function(){
                socket.off('NewMeasurement', null);
                $timeout(() => {
                    ctrl.device = null;
                });
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
                    if(ctrl.modalTemplate.sensor && ctrl.modalTemplate.type && data.sensor == ctrl.modalTemplate.sensor._id && data.name == ctrl.modalTemplate.type._id){
                        $timeout(() => {
                            ctrl.cdata[0].values = [ ...ctrl.cdata[0].values, {UnixTimestamp: (new Date(data.date)).getTime(), v: Math.ceil(data.value*1000)/1000} ].splice(-10);
                            console.log("VALS", ctrl.cdata[0].values);
                        });
                    }
                    if(ctrl.device){
                        let sensor = ctrl.device.sensors.find(s => s._id == data.sensor);
                        if(typeof sensor !== 'undefined'){
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
                                        type.measurements = [ data, ...type.measurements ].splice(-10);
                                    });
                                }
                            }
                        }
                    }
                });
            };

            ctrl.viewDevice = function(device){
                Promise.all(device.sensors.map(s => dmpapi.getSensor(s)))
                .then(sensors => {
                    sensors = sensors.sort(function(a, b) { 
                        return a.name > b.name;
                    });
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
                        measurements = measurements.sort(function(a, b) {
                            return a._id > b._id;
                        });
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
