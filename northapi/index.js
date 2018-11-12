const express = require('express');
const app = express();
const zerorpc = require("zerorpc");
const address = process.env.ZMQ_SERVER_ADDR || 'tcp://127.0.0.1:5000';
 
var client = new zerorpc.Client();
client.connect(address);
 
client.on("error", function(error) {
    console.error("RPC client error:", error);
});

app.get('/fake', function(req, res, next){
    console.log(`[API][Device][Delete] 5be54c2a919931002c3d189a`);
    client.invoke("DeleteDevice", "5be54c2a919931002c3d189a", (err, response, more) => {
        if(err) {
            console.error("INVOKE ERROR", err.message);
            res.status(404).send(err.message);
        }
        else {
            console.log("Device deleted");
            res.status(200).send("Success");
        }
    });
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
        else console.log("Device created:", response);
        let _did = JSON.parse(response)._did;
        client.invoke("GetDevice", _did, (err, response, more) => {
            if(err) {
                console.error("INVOKE ERROR", err);
                res.status(404).send("asd");
            }
            else {
                console.log("Device found:", response); 
                // res.send(response);
                client.invoke("DeleteDevice", _did, (err, response, more) => {
                    if(err) {
                        console.error("INVOKE ERROR", err);
                        res.status(404).send(JSON.stringify(err));
                    }
                    else {
                        res.send("Success");
                    }
                });
            }
        });
    });
});

app.listen(8080, function(){
    console.log('[Status] Northbound gateway listening on port 8080');
});