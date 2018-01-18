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

                if (!error && response.statusCode == 200) {
                    // console.log("+++++++++++++");
                    // console.log(queryParams);
                    resolve(jsonBody);
                } else {
                    console.log("_______________________");
                    console.log("Error getData - " + jsonBody.error);
                    console.log();
                    reject(new Error(jsonBody.error));
                }
            });
        });
    },

    getMiningStats: function(headers, parameters) {
        var url = "https://api.nanopool.org/v1/eth/user/" + parameters.wallet;

        return this.getData(url, headers, parameters);
    },
    getCoinChange: function(headers, parameters) {
        var url = " https://min-api.cryptocompare.com/data/price?fsym=" + parameters.coin + "&tsyms=" + parameters.currency;

        return this.getData(url, headers, parameters);

    },
};