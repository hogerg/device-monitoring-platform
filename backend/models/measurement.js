var Schema = require('mongoose').Schema;
var db = require('../config/db');

let measurementSchema = new Schema({ 
    name: String,
    value: Number,
    unit: String,
    date: { type: Date, default: Date.now },
    sensor: { type: Schema.Types.ObjectId, ref: 'Sensor' }
});

var measurement = db.model('Measurement', measurementSchema);

module.exports = measurement;