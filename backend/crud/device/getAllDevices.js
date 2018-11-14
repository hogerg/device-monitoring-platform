var deviceModel = require('./../../models/device');

module.exports = function() {
    return new Promise((resolve, reject) => {
        deviceModel.find().exec()
        .then(devices => {
            return resolve(devices);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};