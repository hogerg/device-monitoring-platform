var Schema = require('mongoose').Schema;
var db = require('../config/db');
var measurementModel = require('./measurement');

let sensorSchema = new Schema({
    name: String,
    type: String,
    device: { type: Schema.Types.ObjectId, ref: 'Device' }
});

sensorSchema.post('remove', function(removed){
    if(typeof removed === 'undefined' || !removed) return;
    measurementModel.find({ sensor: removed._id}).exec((err, measurements) => {
        measurements.map(m => {
            m.remove();
        });
    });
});

var sensor = db.model('Sensor', sensorSchema);

module.exports = sensor;