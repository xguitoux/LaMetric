var request = require('request');
var Promise = require("bluebird");
var jsonApi = require("./JsonApi");


module.exports = {

    getMiningStats: function(headers, parameters) {
        var url = "https://api.nanopool.org/v1/eth/user/" + parameters.wallet;
        var self = this;

        var dataProm = jsonApi.getData(url, headers, parameters).catch(function(err) {
            console.log("## Error getMiningStats - " + err);
            // console.log(typeof(err));
            // console.log(err.toString());
            console.log();
            if (!err.toString().includes("Account not found")) {

                return Promise.delay(5000).then(function() {
                    self.getMiningStats(headers, parameters);
                });
            }
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
    // getCoinChange: function(headers, parameters) {
    //     var url = " https://min-api.cryptocompare.com/data/price?fsym=" + parameters.coin + "&tsyms=" + parameters.currency;

    //     return jsonApi.getData(url, headers, parameters);

    // },
};