var $ = require('jquery');

var Error = require('../error.js');

module.exports = function(app){
    app.service('dmpapi', function(){
        console.log('DMPAPISERVICE');

        var north = 'http://localhost:8080/api';
        var south = 'http://localhost:8081/api';

        var apicall = function(host, path, data, type = 'GET'){
            return new Promise((resolve, reject)=>{
                console.log("[DMPAPI] " + path, data);
                $.ajax({
                    url: `${host}${path}`,
                    type: type,
                    data: JSON.stringify(data),
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization" : 'Basic ' + Buffer.from("TestUser:SamplePassword").toString('base64')
                    },
                    success: function(data, textStatus, xhr){
                        if(xhr.status == 200 || xhr.status == 201 || xhr.status == 204){
                            resolve(data);
                        }else{
                            reject({
                                status: xhr.status,
                                data: xhr.responseText
                            });
                        }
                    },
                    error: function(xhr, textStatus, err){
                        if(xhr.status == 403){
                            reject(new Error('Authorization error', JSON.parse(xhr.responseText).message, xhr));
                        }else{
                            reject(xhr);
                        }
                    }
                });
            });
        };

        var logger = function(message, json){
            console.log(`[DMPAPI] ${message}`, json ? json : '');
        };

        var parseError = function(err){
            if(err.status == 400) return new Error('Invalid format', JSON.parse(err.responseText).message, err);
            else if (err.status == 401) return new Error('Unauthorized', JSON.parse(err.responseText).message, err);
            else if (err.status == 403) return new Error('Authorization required', JSON.parse(err.responseText).message, err);
            else if (err.status == 404) return new Error('Not found', JSON.parse(err.responseText).message, err);
            else if (err.status == 500) return new Error('Internal server error', JSON.parse(err.responseText).message, err);
            else if(err instanceof Error) return err;
            else return new Error('DMP Error', 'DMP Error', err);
        };

        this.getDevices = function(){
            logger("Get all devices");
            return apicall(north, '/devices')
            .catch(err => {
                throw parseError(err);
            });
        };

        this.getDeviceById = function(id){
            logger(`Get device by id ${id}`);
            return apicall(north, `/devices/${id}`)
            .catch(err => {
                throw parseError(err);
            });
        };

        this.deleteDevice = function(id){
            logger(`Delete device by id ${id}`);
            return apicall(north, `/devices/${id}`, {}, "DELETE")
            .catch(err => {
                throw parseError(err);
            });
        };

        this.getSensor = function(id){
            logger(`Get sensor by id: ${id}`);
            return apicall(north, `/sensors/${id}`)
            .catch(err => {
                throw parseError(err);
            });
        };

        this.sendMeasurement = function(data){
            logger(`Send measurement`, data);
            return apicall(south, `/measurements`, data, "POST")
            .catch(err => {
                throw parseError(err);
            });
        };

        this.registerDevice = function(data){
            logger(`Register new device`, data);
            return apicall(south, `/devices`, data, "POST")
            .catch(err => {
                throw parseError(err);
            });
        };

    });
};
