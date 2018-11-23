var $ = require('jquery');

var Error = require('../error.js');

module.exports = function(app){
    app.service('dmpapi', function(){
        console.log('DMPAPISERVICE');

        var host = 'http://localhost:8080/api';

        var apicall = function(path, data, type = 'GET'){
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
                        if(xhr.status == 200 || xhr.status == 201){
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

        this.getDevices = function() {
            logger("Get all devices");
            return apicall('/devices')
            .catch(err => {
                throw parseError(err);
            });
        };

    });
};
