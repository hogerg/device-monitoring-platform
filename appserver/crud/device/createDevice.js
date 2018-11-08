var deviceModel = require('./../../models/device');

module.exports = function(data) {
    return new Promise((resolve, reject) => {
        var device = new deviceModel();
        device.name = data.name;
        device.save((err, result) => {
            if(err) reject(`Could not create device ${data.name}`);
            resolve(result);
        });
    });
};