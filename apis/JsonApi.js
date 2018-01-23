// import { isNullOrUndefined } from 'util';
const util = require('util');
var request = require('request');
var Promise = require("bluebird");
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

                // console.log("jsonBody");
                // console.log(util.isNullOrUndefined(jsonBody));
                // console.log("------------");
                // console.log(error);
                if (util.isNullOrUndefined(jsonBody)) {
                    reject(new Error("JsonApi.getData - null response"));
                } else
                if (!error && response.statusCode == 200 && !jsonBody.error) {

                    resolve(jsonBody);
                } else {
                    console.log("** Error getData - " + jsonBody.error);
                    console.log("** url : " + url);
                    // console.log(queryParams);
                    //return parent.getData(url, headers, queryParams);
                    reject(new Error(jsonBody.error));
                }
            });
        });
    },

};