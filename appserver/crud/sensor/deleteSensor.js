var sensorModel = require('./../../models/sensor');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        sensorModel.findOneAndDelete({_id: id}).exec()
        .then(sensor => {
            if(sensor == null || typeof sensor === 'undefined') reject(`Sensor with id ${id} not found`);
            resolve(sensor);
        })
        .catch(err => {
            reject(err);
        });
    });
};