var request = require('request');
var Promise = require("bluebird");
var NanoPoolApi = require('./NanoPoolApi')
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
                // console.log(jsonBody);

                if (!error && response.statusCode == 200 && !jsonBody.error) {

                    resolve(jsonBody);
                } else {
                    console.log("_______________________");
                    console.log("Error getData - " + jsonBody.error);
                    console.log();
                    //return parent.getData(url, headers, queryParams);
                    reject(new Error(jsonBody.error));
                }
            });
        });
    },
    getMiningStats: function(headers, parameters) {
        var url = "https://api.nanopool.org/v1/eth/user/" + parameters.wallet;
        var self = this;
        var dataProm = this.getData(url, headers, parameters).catch(function(bal) {
            console.log("________#########__________");
            console.log("Error getMiningStats - " + bal);
            console.log();
            return Promise.delay(5000).then(function() {
                self.getMiningStats(headers, parameters);
            });
            //
        });
        console.log();

        // dataProm.then(function(dataaaaa) {
        //     console.log("dataaaaa--->");
        //     console.log(dataaaaa);
        //     return Promise.resolve(dataProm);
        // }).catch(function(errr) {
        //     console.log("*********dataProm error=" + errr);
        // });
        return dataProm;
    },
    getCoinChange: function(headers, parameters) {
        var url = " https://min-api.cryptocompare.com/data/price?fsym=" + parameters.coin + "&tsyms=" + parameters.currency;

        return this.getData(url, headers, parameters);

    },
};