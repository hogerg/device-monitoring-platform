var Schema = require('mongoose').Schema;
var db = require('../config/db');
var sensorModel = require('./sensor');

let deviceSchema = new Schema({ 
    name: String,
    sensors: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }] 
});

deviceSchema.post('remove', function(removed){
    if(typeof removed === 'undefined' || !removed) return;
    sensorModel.find({ device: removed._id}).exec((err, sensors) => {
        sensors.map(s => {
            s.remove();
        });
    });
});

var device = db.model('Device', deviceSchema);

module.exports = device;