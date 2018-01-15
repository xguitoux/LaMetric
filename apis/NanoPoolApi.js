var request = require('request');
var Promise = require("bluebird");
module.exports = {
    /**
     * Method: getData
     * @return json
     * returns Response called API method
     */
    getData: function(url, header, queryParams) {
        console.log("DANS getData");
        return new Promise(function(resolve, reject) {

            request.get({
                url: url,
                qs: queryParams,
                headers: header,
                rejectUnauthorized: true,
            }, function(error, response, body) {
                console.log("----------body");
                console.log(body);
                var jsonBody = JSON.parse(body);
                if (!error && jsonBody.status) {
                    resolve(jsonBody);
                } else {
                    console.log("Error getData - " + jsonBody.error);
                    console.log();
                    reject(new Error(jsonBody.error));
                }
            });
        });
    },

    getMiningStatsTEST: function(headers, parameters) {
        var walletAdress = parameters.wallet;
        var url = "https://api.nanopool.org/v1/eth/user/" + walletAdress;


        return this.getData(url, headers, parameters);
    },
    getMiningStats: function(headers, parameters) {
        return new Promise(function(resolve, reject) {
            var walletAdress = parameters.wallet;
            var url = "https://api.nanopool.org/v1/eth/user/" + walletAdress;

            var postHeader = {
                'User-Agent': headers.host,
                'Accept': 'application/json',
                'Authorization': headers.authorization // pass authorization header received in request
            };
            request.get({
                url: url,
                qs: parameters,
                headers: postHeader,
                rejectUnauthorized: true,
            }, function(error, response, body) {
                // console.log("error=" + error);
                // console.log("response.body.status=" + JSON.parse(response.body).status);
                //console.log(response);
                var jsonBody = JSON.parse(body);
                if (!error && jsonBody.status) {
                    resolve(jsonBody);
                } else {
                    console.log("Error getMiningStats - " + jsonBody.error);
                    console.log();
                    reject(new Error(jsonBody.error));
                }
            });
        });

    },

    getCoinChange: function(parameters) {
        return new Promise(function(resolve, reject) {
            var url = " https://min-api.cryptocompare.com/data/price?fsym=" + parameters.coin + "&tsyms=" + parameters.currency;

            var postHeader = {
                'User-Agent': parameters.headers.host,
                'Accept': 'application/json',
                'Authorization': parameters.headers.authorization // pass authorization header received in request
            };
            request.get({
                url: url,
                qs: parameters,
                headers: postHeader,
                rejectUnauthorized: true,
            }, function(error, response, body) {
                var jsonBody = JSON.parse(body);

                if (!error && response.statusCode == 200) {
                    try {
                        resolve(jsonBody);
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    console.log("Error getCoinChange");
                    console.log(jsonBody.error);
                    reject(new Error(jsonBody.error));
                }
            });
        });

    },
};