var deviceModel = require('./../../models/device');

module.exports = function(data) {
    console.log("create mw called");
    var device = new deviceModel();
    device.name = data.name;
    device.save((err, result) => {
        if(err) throw new Error("Save error");
        else return result;
    });
};