var Schema = require('mongoose').Schema;
var db = require('../config/db');

var measurement = db.model('Measurement', {
    name: String,
    value: Number,
    unit: String,
    date: { type: Date, default: Date.now },
    sensor: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }]
});

module.exports = measurement;