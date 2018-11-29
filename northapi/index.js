const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const zerorpc = require("zerorpc");
const address = process.env.ZERORPC_SERVER_ADDR || 'tcp://127.0.0.1:5000';
 
var client = new zerorpc.Client();
client.connect(address);
 
client.on("error", function(error) {
    console.error("RPC client error:", error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let authKey = 'Basic ' + Buffer.from("TestUser:SamplePassword").toString('base64');
var checkAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).json({error: "Authorization required"});
    }
    else if (req.headers.authorization != authKey){
        return res.status(401).json({error: "Unauthorized"});
    }
    else next();
};

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.options('*', (req, res) => {
    res.json({
        status: 'OK'
    });
});

var router = express.Router();

router.get('/test', (req, res, next) => {
    // console.log(`[API][Test]`);
    return res.status(204).send();
});

/**
 * @api {get} /devices List all devices
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
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
    // console.log(`[API][Device][Get] List all`);
    client.invoke("GetAllDevices", (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {get} /devices/:id Find device by identifier
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Devices
 * @apiParam {String} id Device id
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
 * @apiErrorExample {json} Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/devices/:id', (req, res, next) => {
    // console.log(`[API][Device][Get] ${req.params.id}`);
    client.invoke("GetDevice", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {delete} /devices/:id Delete device by identifier
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Devices
 * @apiParam {String} id Device id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Device not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/devices/:id', (req, res, next) => {
    // console.log(`[API][Device][Delete] ${req.params.id}`);
    client.invoke("DeleteDevice", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(204).send();
    });
});

/**
 * @api {get} /sensors/:id Find sensor by identifier
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Sensors
 * @apiParam {String} id Sensor id
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
router.get('/sensors/:id', (req, res, next) => {
    // console.log(`[API][Sensor][Get] ${req.params.id}`);
    client.invoke("GetSensor", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {get} /measurements/:id Find measurement by identifier
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Measurements
 * @apiParam {String} id Measurement id
 * @apiSuccess {String} _id Measurement id 
 * @apiSuccess {String} name Measurement name
 * @apiSuccess {Number} value Measurement value
 * @apiSuccess {String} unit Measurement unit
 * @apiSuccess {Date} date Measurement timestamp
 * @apiSuccess {String} sensor Sensor id
 * @apiSuccess {Number} __v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5bea93ea6626e50028386ad1",
 *      "name": "Sensor Value",
 *      "value": 123,
 *      "unit": "°C",
 *      "date": "1542106641525",
 *      "sensor": "5bea93ea6626e50028386ad1",
 *      "__v": 1,
 *    }
 * @apiErrorExample {json} Measurement not found
 *    HTTP/1.1 404 Not Found
 */
router.get('/measurements/:id', (req, res, next) => {
    // console.log(`[API][Measurement][Get] ${req.params.id}`);
    client.invoke("GetMeasurement", req.params.id, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {get} /measurements/latest/:sensor?limit=:limit Find latest measurements by sensor identifier
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Measurements
 * @apiParam {String} sensor Sensor id
 * @apiParam {Query} limit Maximum number of measurements per measurement type
 * @apiSuccess {Object[]} measurements Latest measurements
 * @apiSuccess {String} measurements._id Measurement id 
 * @apiSuccess {String} measurements.name Measurement name
 * @apiSuccess {Number} measurements.value Measurement value
 * @apiSuccess {String} measurements.unit Measurement unit
 * @apiSuccess {Date} measurements.date Measurement timestamp
 * @apiSuccess {String} measurements.sensor Sensor id
 * @apiSuccess {Number} measurements.__v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [
 *      {
 *          "_id": "Temperature",
 *          "measurements": [
 *              {
 *                  "_id": "5bea93ea6626e50028386ad8",
 *                  "name": "Sensor Value",
 *                  "value": 23,
 *                  "unit": "°C",
 *                  "date": "1542106641525",
 *                  "sensor": "5bea93ea6626e50028386ad1"
 *              }
 *          ]
 *      },
 *      {
 *          "_id": "Humidity",
 *          "measurements": [
 *              {
 *                  "_id": "5bea93ea6626e50028386ad9",
 *                  "name": "Sensor Value",
 *                  "value": 64,
 *                  "unit": "%",
 *                  "date": "1542106641525",
 *                  "sensor": "5bea93ea6626e50028386ad2"
 *              }
 *          ]
 *      }
 *    ]
 * @apiErrorExample {json} Sensor not found
 *    HTTP/1.1 404 Not Found
 */
router.get('/measurements/latest/:sensor', (req, res, next) => {
    // console.log(`[API][Measurement][Get] Get latest measurements (limit: ${req.query.limit || 1}) for sensor ${req.params.sensor}`);
    client.invoke("GetLatestMeasurements", req.params.sensor, req.query.limit || 1, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

/**
 * @api {get} /measurements/sensor/:sensor Find all measurements by sensor identifier
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Measurements
 * @apiParam {String} sensor Sensor id
 * @apiSuccess {Object[]} measurements Measurement list
 * @apiSuccess {String} measurement._id Measurement id 
 * @apiSuccess {String} measurement.name Measurement name
 * @apiSuccess {Number} measurement.value Measurement value
 * @apiSuccess {String} measurement.unit Measurement unit
 * @apiSuccess {Date} measurement.date Measurement timestamp
 * @apiSuccess {String} measurement.sensor Sensor id
 * @apiSuccess {Number} measurement.__v Metadata containing the document revision number
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [
 *       {
 *          "_id": "5bea93ea6626e50028386ad1",
 *          "name": "Sensor Value",
 *          "value": 28,
 *          "unit": "°C",
 *          "date": "1542106641525",
 *          "sensor": "5bea93ea6626e50028386ad1",
 *          "__v": 1
 *       },
 *       {
 *          "_id": "5bea93ea6626e50028386ad2",
 *          "name": "Sensor Value",
 *          "value": 25,
 *          "unit": "°C",
 *          "date": "1542106690000",
 *          "sensor": "5bea93ea6626e50028386ad1",
 *          "__v": 1
 *       }
 *    ]
 * @apiErrorExample {json} Measurement not found
 *    HTTP/1.1 404 Not Found
 */
router.get('/measurements/sensor/:sensor', (req, res, next) => {
    // console.log(`[API][Measurement][Get] Get measurements for sensor ${req.params.sensor}`);
    client.invoke("GetMeasurementsBySensorId", req.params.sensor, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(200).send(JSON.parse(response));
    });
});

app.use('/api', checkAuth, router);
app.use('/', express.static('apidoc'));

app.listen(8080, function(){
    // console.log('[Status] Northbound gateway listening on port 8080');
});