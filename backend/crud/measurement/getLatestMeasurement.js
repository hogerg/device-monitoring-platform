var measurementModel = require('./../../models/measurement');

module.exports = function(sensorId, name) {
    return new Promise((resolve, reject) => {
        measurementModel.findOne({sensor: sensorId, name: name}).sort({date: -1}).exec()
        .then(measurement => {
            return resolve(measurement);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};