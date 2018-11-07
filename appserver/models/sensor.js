var Schema = require('mongoose').Schema;
var db = require('/config/db');

var sensor = db.model('Sensor', {
    name: String,
    type: String,
    device: [{ type: Schema.Types.ObjectId, ref: 'Device' }]
});

module.exports = sensor;


// sensor.findOne({_id: 'xxxxxxx'}).populate('device', '_id name').exec(function(err, dev) {
//     console.log(dev);
// });