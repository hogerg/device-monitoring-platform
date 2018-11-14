var mongoose = require('mongoose');

module.exports = function(id) {
    return new Promise((resolve, reject) => {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            console.error(`[Validator] Invalid identifier: ${id}`);
            return reject({status: 400, message: 'Invalid identifier'});
        }
        return resolve(id);
    });
}