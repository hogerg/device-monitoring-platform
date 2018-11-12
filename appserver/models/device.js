var Schema = require('mongoose').Schema;
var db = require('../config/db');

let deviceSchema = new Schema({ 
    name: String,
    sensors: [{ type: Schema.Types.ObjectId, ref: 'Sensor' }] 
});

deviceSchema.post('remove', function(removed){
    if(typeof removed === 'undefined' || !removed) return;
    console.log('removed', removed);
});

var device = db.model('Device', deviceSchema);

module.exports = device;