define({ "api": [
  {
    "type": "get",
    "url": "/device/:id",
    "title": "Find device by identifier",
    "group": "Devices",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>Device id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Device id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Device name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "sensors",
            "description": "<p>Sensors in the device</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "__v",
            "description": "<p>Metadata containing the document revision number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"5bea93ea6626e50028386ad1\",\n  \"name\": \"foo\"\n  \"sensors\": [\"5bea93ea6626e50028386ad2\", \"5bea93ea6626e50028386ad3\"]\n  \"__v\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Device not found",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Devices",
    "name": "GetDeviceId"
  },
  {
    "type": "get",
    "url": "/devices",
    "title": "List all devices",
    "group": "Devices",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "devices",
            "description": "<p>Device list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "devices._id",
            "description": "<p>Device id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "devices.name",
            "description": "<p>Device name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "devices.sensors",
            "description": "<p>Sensors in the device</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "devices.__v",
            "description": "<p>Metadata containing the document revision number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n[{\n  \"_id\": \"5bea93ea6626e50028386ad1\",\n  \"name\": \"foo\"\n  \"sensors\": [\"5bea93ea6626e50028386ad2\", \"5bea93ea6626e50028386ad3\"]\n  \"__v\": 1,\n},\n{\n  \"_id\": \"5bea93ea6626e50028386ad4\",\n  \"name\": \"bar\"\n  \"sensors\": [\"5bea93ea6626e50028386ad5\", \"5bea93ea6626e50028386ad6\"]\n  \"__v\": 1,\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Devices",
    "name": "GetDevices"
  },
  {
    "type": "post",
    "url": "/device",
    "title": "Create a new device",
    "group": "Devices",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "device",
            "description": "<p>Device data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device.name",
            "description": "<p>Device name</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "sensors",
            "description": "<p>Sensor data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sensors.name",
            "description": "<p>Sensor name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sensors.type",
            "description": "<p>Type type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"device\": { \n      \"name\": \"foo\" \n  },\n  \"sensors\" [\n      {\n          \"name\": \"bar\",\n          \"type\": \"bartype\"\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Device id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n  \"_id\": \"5bea93ea6626e50028386ad1\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Internal Server Error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Devices",
    "name": "PostDevice"
  },
  {
    "type": "get",
    "url": "/measurement/:id",
    "title": "Find measurement by identifier",
    "group": "Measurements",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>Measurement id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Measurement id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Measurement name</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "value",
            "description": "<p>Measurement value</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "unit",
            "description": "<p>Unit of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date of measurement</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sensor",
            "description": "<p>Sensor id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "__v",
            "description": "<p>Metadata containing the document revision number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"5bea93ea6626e50028386ad1\",\n  \"name\": \"Kitchen Temperature Sensor\",\n  \"value\": 123,\n  \"unit\": \"°C\",\n  \"date\": \"1542106641525\",\n  \"sensor\": \"5bea93ea6626e50028386ad1\",\n  \"__v\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Measurement not found",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Measurements",
    "name": "GetMeasurementId"
  },
  {
    "type": "get",
    "url": "/sensor/:id",
    "title": "Find sensor by identifier",
    "group": "Sensors",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "id",
            "description": "<p>Sensor id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Sensor id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Sensor name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Sensor type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "device",
            "description": "<p>Device id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "__v",
            "description": "<p>Metadata containing the document revision number</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"5bea93ea6626e50028386ad1\",\n  \"name\": \"foo\"\n  \"type\": \"bar\"\n  \"__v\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Device not found",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Sensors",
    "name": "GetSensorId"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./apidoc/main.js",
    "group": "_home_ehodger_Work_device_monitoring_platform_northapi_apidoc_main_js",
    "groupTitle": "_home_ehodger_Work_device_monitoring_platform_northapi_apidoc_main_js",
    "name": ""
  }
] });
