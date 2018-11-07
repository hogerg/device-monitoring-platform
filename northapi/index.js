// const express = require('express');
// const app = express();

const socket = require(`zmq`).socket(`pub`);
const address = process.env.ZMQ_BIND_ADDR || `tcp://*:5000`;
socket.bindSync(address);

const sendMessage = function () {
    const message = `testmessage`;
    console.log(`Sending '${message}'`);
    socket.send(['Ping', message]);
};

setInterval(sendMessage, 2000);

// app.get('/', function(req, res, next){
//     let testData = new testModel({a: "Test", b: 1});
//     testData.save((err) => {
//         if(err) console.error(err);
//         else {
//             console.log("Save successful");
//             testModel.find({}, (err, items) => {
//                 if(err) console.error("Error finding items");
//                 else console.log(items);
//             });
//         }
//     });
//     res.send("Hello World!");
// });

// app.listen(3000, function(){
//     console.log('Example app listening on port 3000!');
// });