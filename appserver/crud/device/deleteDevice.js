var deviceModel = require('./../../models/device');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        // deviceModel.findOneAndDelete({_id: id}).exec()
        // .then(device => {
        //     if(device == null || typeof device === 'undefined') reject(`Device with id ${id} not found`);
        //     resolve(device);
        // })
        // .catch(err => {
        //     reject(err);
        // });
        
        // deviceModel.remove({_id: id}).setOptions({single: true}).exec((err, device) => {
        //     if(err) reject(err);
        //     if(device.n == 0) reject(`Device with id ${id} not found`);
        //     resolve(device);
        // });

        deviceModel.findById(id, (err, device) => {
            if(err) reject(err);
            if(device == null || typeof device === 'undefined') reject(`Device with id ${id} not found`);
            device.remove((err, d) => {
                if(err) reject(err);
                resolve(device);
            });
        });
    });
};