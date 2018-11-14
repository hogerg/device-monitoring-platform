var measurementModel = require('./../../models/measurement');

module.exports = function(sensorId) {
    return new Promise((resolve, reject) => {
        measurementModel.find({sensor: sensorId}).exec()
        .then(measurements => {
            return resolve(measurements);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};