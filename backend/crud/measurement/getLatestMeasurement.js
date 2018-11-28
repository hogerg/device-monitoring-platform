var measurementModel = require('./../../models/measurement');
var mongoose = require('mongoose');

module.exports = function(sensorId, limit) {
    return new Promise((resolve, reject) => {
        measurementModel.aggregate([
            { $match: 
                { 
                    "sensor": mongoose.Types.ObjectId(sensorId)
                } 
            }, 
            { 
                $sort: {
                    "name":1, "date":-1
                } 
            }, 
            { 
                $group: {
                    "_id": "$name", 
                    "measurements": { 
                        $push: { 
                            "_id": "$_id",
                            "name": "$name", 
                            "value": "$value", 
                            "unit": "$unit", 
                            "date": "$date", 
                            "sensor": "$sensor" 
                        } 
                    } 
                }
            }, 
            { 
                $project: { 
                    "measurements": { 
                        $slice: [ "$measurements", Number(limit)] 
                    } 
                }
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