const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const zerorpc = require("zerorpc");
const address = process.env.ZMQ_SERVER_ADDR || 'tcp://127.0.0.1:5000';
 
var client = new zerorpc.Client();
client.connect(address);
 
client.on("error", function(error) {
    console.error("RPC client error:", error);
});

var router = express.Router();

/**
 * @api {get} /devices List all devices
 * @apiGroup Devices
 * @apiSuccess {Object[]} devices Device list
 * @apiSuccess {String} devices._id Device id 
 * @apiSuccess {String} devices.name Device name
 * @apiSuccess {String[]} devices.sensors Sensors in the device
 * @apiSuccess {Number} devices.__v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "_id": "5bea93ea6626e50028386ad1",
 *      "name": "foo"
 *      "sensors": ["5bea93ea6626e50028386ad2", "5bea93ea6626e50028386ad3"]
 *      "__v": 1,
 *    },
 *    {
 *      "_id": "5bea93ea6626e50028386ad4",
 *      "name": "bar"
 *      "sensors": ["5bea93ea6626e50028386ad5", "5bea93ea6626e50028386ad6"]
 *      "__v": 1,
 *    }]
 * @apiErrorExample {json} Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/devices', (req, res, next) => {
    console.log(`[API][Device][Get] List all`);
    client.invoke("GetAllDevices", (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {get} /device/:id Find device by identifier
 * @apiGroup Devices
 * @apiParam {id} id Device id
 * @apiSuccess {String} _id Device id 
 * @apiSuccess {String} name Device name
 * @apiSuccess {String[]} sensors Sensors in the device
 * @apiSuccess {Number} __v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5bea93ea6626e50028386ad1",
 *      "name": "foo"
 *      "sensors": ["5bea93ea6626e50028386ad2", "5bea93ea6626e50028386ad3"]
 *      "__v": 1,
 *    }
 * @apiErrorExample {json} Device not found
 *    HTTP/1.1 404 Not Found
 */
router.get('/device/:id', (req, res, next) => {
    console.log(`[API][Device][Get] ${req.params.id}`);
    client.invoke("GetDevice", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {post} /device Create a new device
 * @apiGroup Devices
 * @apiParam {Object} device Device data
 * @apiParam {String} device.name Device name
 * @apiParam {Object[]} sensors Sensor data
 * @apiParam {String} sensors.name Sensor name
 * @apiParam {String} sensors.type Type type
 * @apiParamExample {json} Input
 *    {
 *      "device": { 
 *          "name": "foo" 
 *      },
 *      "sensors" [
 *          {
 *              "name": "bar",
 *              "type": "bartype"
 *          }
 *      ]
 *    }
 * @apiSuccess {String} _id Device id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *    {
 *      "_id": "5bea93ea6626e50028386ad1"
 *    }
 * @apiErrorExample {json} Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/device', (req, res, next) => {
    console.log(`[API][Device][Create] ${req.body.device.name}`);
    client.invoke("CreateDevice", req.body, (err, reponse, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(201).send(JSON.parse(response));
    });
});

router.delete('/device/:id', (req, res, next) => {
    console.log(`[API][Device][Delete] ${req.params.id}`);
    client.invoke("DeleteDevice", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(204).send();
    });
});

/**
 * @api {get} /sensor/:id Find sensor by identifier
 * @apiGroup Sensors
 * @apiParam {id} id Sensor id
 * @apiSuccess {String} _id Sensor id 
 * @apiSuccess {String} name Sensor name
 * @apiSuccess {String} type Sensor type
 * @apiSuccess {String} device Device id
 * @apiSuccess {Number} __v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5bea93ea6626e50028386ad1",
 *      "name": "foo"
 *      "type": "bar"
 *      "__v": 1,
 *    }
 * @apiErrorExample {json} Device not found
 *    HTTP/1.1 404 Not Found
 */
router.get('/sensor/:id', (req, res, next) => {
    console.log(`[API][Sensor][Get] ${req.params.id}`);
    client.invoke("GetSensor", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {get} /measurement/:id Find measurement by identifier
 * @apiGroup Measurements
 * @apiParam {id} id Measurement id
 * @apiSuccess {String} _id Measurement id 
 * @apiSuccess {String} name Measurement name
 * @apiSuccess {Number} value Measurement value
 * @apiSuccess {String} unit Unit of measurement
 * @apiSuccess {Date} date Date of measurement
 * @apiSuccess {String} sensor Sensor id
 * @apiSuccess {Number} __v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5bea93ea6626e50028386ad1",
 *      "name": "Kitchen Temperature Sensor",
 *      "value": 123,
 *      "unit": "°C",
 *      "date": "1542106641525",
 *      "sensor": "5bea93ea6626e50028386ad1",
 *      "__v": 1,
 *    }
 * @apiErrorExample {json} Measurement not found
 *    HTTP/1.1 404 Not Found
 */
router.get('/measurement/:id', (req, res, next) => {
    console.log(`[API][Measurement][Get] ${req.params.id}`);
    client.invoke("GetMeasurement", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

// router.get('/', function(req, res, next){
//     const data = { 
//         device: { 
//             name:`testdevice-${Math.round(Math.random() * 100)}` 
//         },
//         sensors: [
//             {
//                 name: 'Temp1',
//                 type: 'Temperature'
//             },
//             {
//                 name: 'Hum1',
//                 type: 'Humidity'
//             }
//         ]
//     };
//     console.log(`[API][Device][Create] ${data.device.name}`);
//     client.invoke("CreateDevice", data, (err, response, more) => {
//         if(err) console.error("INVOKE ERROR", err);
//         else console.log("Device created:", response);
//         let _did = JSON.parse(response)._did;
//         client.invoke("GetDevice", _did, (err, response, more) => {
//             if(err) {
//                 console.error("INVOKE ERROR", err);
//                 res.status(404).send("asd");
//             }
//             else {
//                 console.log("Device found:", response); 
//                 // res.send(response);
//                 client.invoke("DeleteDevice", _did, (err, response, more) => {
//                     if(err) {
//                         console.error("INVOKE ERROR", err);
//                         res.status(404).send(err);
//                     }
//                     else {
//                         res.send("Success");
//                     }
//                 });
//             }
//         });
//     });
// });

app.use('/api', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('apidoc'));

app.listen(8080, function(){
    console.log('[Status] Northbound gateway listening on port 8080');
});