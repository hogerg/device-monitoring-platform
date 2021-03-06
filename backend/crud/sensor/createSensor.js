var sensorModel = require('./../../models/sensor');

module.exports = function(data) {
    return new Promise((resolve, reject) => {
        var sensor = new sensorModel();
        sensor.name = data.name;
        sensor.type = data.type;
        sensor.device = data.device;
        sensor.save((err, result) => {
            if(err) return reject({status: 500, message: `Internal Server Error: ${err}`});
            return resolve(result);
        });
    });
};