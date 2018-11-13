var measurementModel = require('./../../models/measurement');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        measurementModel.findOne({_id: id}).exec()
        .then(measurement => {
            if(measurement == null) return reject({status: 404, message: `Measurement with id ${id} not found`});
            return resolve(measurement);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};