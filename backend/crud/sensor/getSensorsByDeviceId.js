var sensorModel = require('./../../models/sensor');

module.exports = function(deviceId) {
    return new Promise((resolve, reject) => {
        sensorModel.find({device: deviceId}).exec()
        .then(sensors => {
            return resolve(sensors);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};