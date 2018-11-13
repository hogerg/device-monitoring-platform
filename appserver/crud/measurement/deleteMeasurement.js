var measurementModel = require('./../../models/measurement');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        measurementModel.findById(id, (err, measurement) => {
            if(err || measurement == null || typeof measurement === 'undefined') {
                return reject({status: 404, message: `Measurement with id ${id} not found`});
            }
            measurement.remove((err, m) => {
                if(err) return reject({status: 500, message: `Internal Server Error: ${err}`});
                return resolve(measurement);
            });
        });
    });
};