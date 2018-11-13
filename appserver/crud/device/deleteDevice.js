var deviceModel = require('./../../models/device');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        deviceModel.findById(id, (err, device) => {
            if(err || device == null || typeof device === 'undefined') {
                return reject({status: 404, message: `Device with id ${id} not found`});
            }
            device.remove((err, d) => {
                if(err) return reject({status: 500, message: `Internal Server Error: ${err}`});
                return resolve(device);
            });
        });
    });
};