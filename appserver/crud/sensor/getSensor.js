var sensorModel = require('./../../models/sensor');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        sensorModel.findOne({_id: id}).exec()
        .then(sensor => {
            if(sensor == null) return reject({status: 404, message: `Sensor with id ${id} not found`});
            return resolve(sensor);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};