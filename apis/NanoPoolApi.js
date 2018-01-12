var request = require('request');
var Promise = require("bluebird");
module.exports = {
    /**
     * Method: getData
     * @return json
     * returns Response called API method
     */
    getData: function(url, header, queryParams, callback) {

        request.get({
            url: url,
            qs: queryParams,
            headers: header,
            rejectUnauthorized: true,
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    callback(null, response, JSON.parse(body));
                } catch (err) {
                    callback(err, response);
                }
            } else {
                callback(error, response, null);
            }
        });
    },
    getMiningStats: function(headers, parameters, callback) {

        var walletAdress = parameters.wallet;
        var url = "https://api.nanopool.org/v1/eth/user/" + walletAdress;

        var postHeader = {
            'User-Agent': headers.host,
            'Accept': 'application/json',
            'Authorization': headers.authorization // pass authorization header received in request
        };
        this.getData(url, postHeader, parameters, callback);

    },
    getCoinChange: function(parameters, callback) {

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
            if (!error && response.statusCode == 200) {
                try {
                    callback(null, response, JSON.parse(body));
                } catch (err) {
                    callback(err, response);
                }
            } else {
                callback(error, response, null);
            }
        });

    },
    getCoinChangeProm: function(parameters) {
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
                if (!error && response.statusCode == 200) {
                    try {
                        resolve(response);
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    reject(err);
                }
            });
        });

    },
};