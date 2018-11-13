var deviceModel = require('./../../models/device');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        deviceModel.findOne({_id: id}).exec()
        .then(device => {
            if(device == null) return reject({status: 404, message: `Device with id ${id} not found`});
            return resolve(device);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};