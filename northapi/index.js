const express = require('express');
const app = express();
const zerorpc = require("zerorpc");
const address = process.env.ZMQ_SERVER_ADDR || 'tcp://127.0.0.1:5000';
 
var client = new zerorpc.Client();
client.connect(address);
 
client.on("error", function(error) {
    console.error("RPC client error:", error);
});

app.get('/', function(req, res, next){
    const data = { 
        device: { 
            name:`testdevice-${Math.round(Math.random() * 100)}` 
        },
        sensors: [
            {
                name: 'Temp1',
                type: 'Temperature'
            },
            {
                name: 'Hum1',
                type: 'Humidity'
            }
        ]
    };
    console.log(`[API][Device][Create] ${data.device.name}`);
    client.invoke("CreateDevice", data, (err, response, more) => {
        if(err) console.error("INVOKE ERROR", err);
        else console.log("RPC INVOKED", response);
        res.send("Hello World!");
    });
});

app.listen(8080, function(){
    console.log('[Status] Northbound gateway listening on port 8080');
});