var measurementModel = require('./../../models/measurement');

module.exports = function(data) {
    return new Promise((resolve, reject) => {
        var measurement = new measurementModel();
        measurement.name = data.name;
        measurement.value = data.value;
        measurement.unit = data.unit;
        measurement.date = Date.now();
        measurement.sensor = data.sensor;
        measurement.save((err, result) => {
            if(err) return reject({status: 500, message: `Internal Server Error: ${err}`});
            return resolve(result);
        });
    });
};