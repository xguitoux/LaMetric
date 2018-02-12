var request = require('request'),
    Promise = require("bluebird"),
    jsonApi = require("./JsonApi"),
    jsonValues = require('../consts/jsonValues');


module.exports = {

    getMiningStatsOLD: function(headers, parameters) {
        var url = "https://api.nanopool.org/v1/eth/user/" + parameters.wallet;
        var self = this;

        var dataProm = jsonApi.getData(url, headers, parameters).then(function(jsonBody) {
            console.log("_________________");
            console.log(jsonBody);
            if (jsonBody.status != null) {
                if (!jsonBody.status) {
                    if (!jsonBody.error.toString().includes("Account not found")) {
                        console.log("+++++++++++++");
                        return Promise.delay(5000).then(function() {
                            self.getMiningStats(headers, parameters);
                        });
                    } else {
                        console.log("NanoPoolApi UNKNOWN ACCOUNT --> " + parameters.wallet);
                        return jsonValues.unknowNanoAccount;
                    }
                } else {
                    return jsonBody;
                }
            }
        });
        return dataProm;
    },
    getMiningStats: function(headers, parameters) {
        var self = this;
        return new Promise(function(resolve) {
            var url = "https://api.nanopool.org/v1/eth/user/" + parameters.wallet;

            return jsonApi.getData(url, headers, parameters).then(function(jsonBody) {
                // console.log("______DANS THEN___________");
                // console.log(jsonBody);
                if (jsonBody.status != null) {
                    if (!jsonBody.status) {
                        if (!jsonBody.error.toString().includes("Account not found")) {
                            Promise.delay(2500).then(function() {
                                return self.getMiningStats(headers, parameters);
                            });
                        } else {
                            console.log("NanoPoolApi UNKNOWN ACCOUNT --> " + parameters.wallet);
                            resolve(jsonValues.unknowNanoAccount);
                        }
                    } else {
                        // console.log("On resolve avec la bonne value");
                        resolve(jsonBody);
                    }
                }
            });
        });
    },
};