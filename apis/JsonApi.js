// import { isNullOrUndefined } from 'util';
var util = require('util');
var request = require('request');
var Promise = require("bluebird");
var rp = require('request-promise');
module.exports = {
    /**
     * Method: getData
     * @return json
     * returns Response called API method
     */
    getData: function(url, headers, queryParams) {
        return new Promise(function(resolve, reject) {

            var postHeader = {
                'User-Agent': headers.host,
                'Accept': 'application/json',
                'Authorization': headers.authorization // pass authorization header received in request
            };
            request.get({
                url: url,
                qs: queryParams,
                headers: postHeader,
                rejectUnauthorized: true,
            }, function(error, response, body) {
                var jsonBody = JSON.parse(body);


                if (util.isNullOrUndefined(jsonBody)) {
                    reject(new Error("JsonApi.getData - null response"));
                } else
                if (!error && response.statusCode == 200 && !jsonBody.error) {

                    resolve(jsonBody);
                } else {
                    // console.log("** Error getData - " + jsonBody.error);
                    // console.log("** url : " + url);
                    reject(new Error(jsonBody.error));
                }
            });
        });
    },
    getDataProm: function(url, p_headers, queryParams) {

        var options = {
            uri: url,
            headers: {
                'User-Agent': p_headers.host,
                'Accept': 'application/json',
                'Authorization': p_headers.authorization // pass authorization header received in request
            },
            json: true // Automatically stringifies the body to JSON
        };
        // console.log(options);
        return rp(options).promise().then(function(jsonBody) {

            console.log("getDataProm dans THEN");
            // console.log(jsonBody);
            return jsonBody;
            // if (util.isNullOrUndefined(jsonBody)) {
            //     reject(new Error("JsonApi.getData - null response"));
            // } else
            // if (!error && response.statusCode == 200 && !jsonBody.error) {

            //process(jsonBody);
            // } else {
            //     reject(new Error(jsonBody.error));
            // }
        }).catch(function(error) {
            console.log("getDataProm dans CATCH");
            console.log(error);
            // if (util.isNullOrUndefined(jsonBody)) {
            //     reject(new Error("JsonApi.getData - null response"));
            // } else {
            //     reject(new Error(jsonBody.error));
            // }
        });
    },

};