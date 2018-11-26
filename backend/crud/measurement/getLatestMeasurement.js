var measurementModel = require('./../../models/measurement');
var mongoose = require('mongoose');

module.exports = function(sensorId) {
    return new Promise((resolve, reject) => {
        measurementModel.aggregate([
            { "$match": { "sensor": mongoose.Types.ObjectId(sensorId) } },
            { "$sort": { "name": 1, "date": -1 } },
            { "$group": {
                "_id": "$name",
                "name": { "$first": "$name" },
                "value": { "$first": "$value" },
                "unit": { "$first": "$unit" },
                "date": { "$first": "$date" },
                "sensor": { "$first": "$sensor" } }
            }
        ]).exec()
        .then(measurements => {
            return resolve(measurements);
        })
        .catch(err => {
            return reject({status: 500, message: `Internal Server Error: ${err}`});
        });
    });
};