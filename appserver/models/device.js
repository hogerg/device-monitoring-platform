var Schema = require('mongoose').Schema;
var db = require('../config/db');

var device = db.model('Device', {
    name: String,
    sensors: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }]
});

module.exports = device;