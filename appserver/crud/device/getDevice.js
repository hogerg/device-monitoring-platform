var deviceModel = require('./../../models/device');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        deviceModel.findOne({_id: id}).exec()
        .then(device => {
            if(device == null) reject(`Device with id ${id} not found`);
            resolve(device);
        })
        .catch(err => {
            reject(err);
        });
    });
};