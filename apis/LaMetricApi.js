/*jshint esversion: 6 */
var Promise = require("bluebird");
var NanoPoolApi = require('./NanoPoolApi');

Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});


module.exports = {

    /**
     * Method: buildHotsResponse
     * @return json
     * returns LaMetric readable Json
     */
    buildHotsResponse: function(req, data) {

        // Building object for LaMetric. We will return it
        var responseObj = {};
        responseObj.frames = [];

        index = 0;

        var leagues = req.query.leagues.split(',');
        var spaceLessLeagues = [];
        // Removing white spaces
        leagues.forEach(element => {

            element = element.replace(/\s+/g, '');
            spaceLessLeagues.push(element);
        });

        if (!data) {
            return false;
        } else {

            data.LeaderboardRankings.forEach(element => {

                if (spaceLessLeagues.indexOf(element.GameMode) >= 0) {

                    var frame = {
                        'index': index,
                        'text': element.GameMode,
                        'icon': 'i280',
                    };
                    index++;

                    switch (element.LeagueID) {
                        case 0:
                            frame.icon = "i635"; // Master icon
                            break;
                        case 1:
                            frame.icon = "i5273"; // Diams icon
                            break;
                        case 2:
                            frame.icon = "i5271"; // Plat icon
                            break;
                        case 3:
                            frame.icon = "i5274"; // Gold icon
                            break;
                        case 4:
                            frame.icon = "i5270"; // Silver icon
                            break;
                        case 5:
                            frame.icon = "i5269"; // Bronze icon
                            break;
                    }
                    responseObj.frames.push(frame);
                }
            });

            return responseObj;
        }
    },

    /**
     * Method: buildNanoResponse
     * @return json
     * returns LaMetric readable Json
     */
    buildNanoResponse: function(req, dataResp) {

        return new Promise(function(resolve) {
            // Building object for LaMetric. We will return it
            var responseObj = {};
            responseObj.frames = [];

            index = 0;
            console.log("----------------");
            console.log(dataResp.data);
            console.log("----------------");

            if (!dataResp) {
                return false;
            } else {

                var nanoBalance = dataResp.data.balance;
                var balanceFrame = {
                    'index': index,
                    'text': nanoBalance,
                    'icon': 'i11861',
                };
                responseObj.frames.push(balanceFrame);
                index++;

                var balanceFiatSymbol = "";
                var coinProm;
                balanceFiatSymbol = req.query.balance_value;
                // console.log("---balance_value=" + req.query.balance_value);
                var params = {
                    coin: "ETH",
                    currency: balanceFiatSymbol,
                    headers: req.headers
                };


                coinProm = NanoPoolApi.getCoinChangeProm(params).then(function(data) {
                    console.log();
                    console.log("-----DANS 1er then");
                    if (!data) {
                        return "Error";
                    } else {

                        // console.log("nanoBalance=" + nanoBalance);
                        // console.log("req.query.balance_value=" + balanceFiatSymbol);
                        var coinValinFiat = JSON.parse(data.body)[balanceFiatSymbol];
                        // console.log();
                        // console.log("#######");
                        var balanceValue = nanoBalance * coinValinFiat;
                        // console.log(balanceValue + "€");
                        balanceValue = Number((balanceValue).toFixed(2));

                        // Dollar icon i34
                        // Euro icon i3213
                        var balanceValueFrame = {
                            'index': index,
                            'text': balanceValue,
                            'icon': 'i34',
                        };
                        console.log("balanceValue=" + balanceValue);
                        console.log(balanceValueFrame);

                        responseObj.frames.push(balanceValueFrame);
                        index++;

                    }

                    // Si on doit afficher des hashrates
                    if (req.query.infos != null) {

                        var infos = req.query.infos.split(',');
                        var hashrate = dataResp.data.hashrate;
                        var h1hashrate = dataResp.data.avgHashrate.h1;
                        var h3hashrate = dataResp.data.avgHashrate.h3;
                        var h6hashrate = dataResp.data.avgHashrate.h6;
                        var h12hashrate = dataResp.data.avgHashrate.h12;
                        var h24hashrate = dataResp.data.avgHashrate.h24;

                        infos.forEach(element => {

                            var frame = {
                                'index': index,
                                'text': "",
                                'icon': 'i11861',
                            };

                            element = element.replace(/\s+/g, '');

                            switch (element) {
                                case "CurrentHash":
                                    frame.text = "H:" + hashrate;
                                    frame.icon = "i5273"; // Diams icon
                                    break;
                                case "AvgHash1h":
                                    frame.text = "H1:" + h1hashrate;
                                    frame.icon = "i5273"; // Diams icon
                                    break;
                                case "AvgHash3h":
                                    frame.text = "H3:" + h3hashrate;
                                    frame.icon = "i5271"; // Plat icon
                                    break;
                                case "AvgHash6h":
                                    frame.text = "H6:" + h6hashrate;
                                    frame.icon = "i5274"; // Gold icon
                                    break;
                                case "AvgHash12h":
                                    frame.text = "H12:" + h12hashrate;
                                    frame.icon = "i5270"; // Silver icon
                                    break;
                                case "AvgHash24h":
                                    frame.text = "H24:" + h24hashrate;
                                    frame.icon = "i5269"; // Bronze icon
                                    break;
                            }

                            index++;
                            responseObj.frames.push(frame);
                        });
                    }
                }).finally(function() {
                    resolve(responseObj);
                });
            }
        });
    }
};