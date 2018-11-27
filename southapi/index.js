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

/**
 * @api {post} /devices Create a new device
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
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
router.post('/devices', (req, res, next) => {
    console.log(`[API][Device][Create] ${req.body.device.name}`);
    client.invoke("CreateDevice", req.body, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(201).send(JSON.parse(response));
    });
});

/**
 * @api {post} /measurements Create a new measurement
 * @apiHeader {String} Authorization Basic authorization key
 * @apiHeaderExample {json} Header example:
 *     {
 *       "Authorization": "Basic UmFuZG9tVGVzdE5hbWU6QW5vdGhlclBhc3M="
 *     }
 * @apiGroup Measurements
 * @apiParam {String} name Measurement name
 * @apiParam {Number} value Measurement value
 * @apiParam {String} unit Measurement unit
 * @apiParam {Date} date Measurement timestamp
 * @apiParam {String} sensor Sensor id
 * @apiParamExample {json} Input
 *    {
 *      "name": "foo",
 *      "value": 123,
 *      "unit": "°C",
 *      "date": 123123123,
 *      "sensor": "5bea93ea6626e50028386ad1"
 *    }
 * @apiSuccess {String} _id Measurement id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 201 Created
 *    {
 *      "_id": "5bea93ea6626e50028386ad2"
 *    }
 * @apiErrorExample {json} Internal Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/measurements', (req, res, next) => {
    console.log(`[API][Measurement][Create] ${req.body.name}`);
    client.invoke("CreateMeasurement", req.body, (err, response, more) => {
        if(err) {
            err = JSON.parse(err.message);
            return res.status(err.status).send({error: err.message});
        }
        return res.status(201).send(JSON.parse(response));
    });
});

app.use('/api', checkAuth, router);
app.use('/', express.static('apidoc'));

app.listen(8080, function(){
    console.log('[Status] Southbound gateway listening on port 8080');
});