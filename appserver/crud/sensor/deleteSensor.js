var sensorModel = require('./../../models/sensor');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        // sensorModel.findOneAndDelete({_id: id}).exec()
        // .then(sensor => {
        //     if(sensor == null || typeof sensor === 'undefined') return reject({status: 400, message: `Sensor with id ${id} not found`});
        //     return resolve(sensor);
        // })
        // .catch(err => {
        //     return reject({status: 500, message: `Internal Server Error: ${err}`});
        // });
        sensorModel.findById(id, (err, sensor) => {
            if(err || sensor == null || typeof sensor === 'undefined') {
                return reject({status: 404, message: `Sensor with id ${id} not found`});
            }
            sensor.remove((err, s) => {
                if(err) return reject({status: 500, message: `Internal Server Error: ${err}`});
                return resolve(sensor);
            });
        });
    });
};