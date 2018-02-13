/*jshint esversion: 6 */
var Promise = require("bluebird"),
    NanoPoolApi = require('./NanoPoolApi'),
    CryptoApi = require("./CryptoApi"),
    jsonValues = require('../consts/jsonValues'),
    iconValues = require('../consts/iconValues');

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
        return new Promise(function(resolve, reject) {

            if (!data) {
                reject(new Error("No Hots data found"));
            } else {

                // Building object for LaMetric. We will return it
                var responseObj = {};
                responseObj.frames = [];

                responseObj.frames.push({
                    'index': 0,
                    'text': req.query.battleTag,
                    'icon': 'i14830',
                });

                var leagues = req.query.leagues.split(',');
                var spaceLessLeagues = [];
                // Removing white spaces
                leagues.forEach(element => {

                    element = element.replace(/\s+/g, '');
                    spaceLessLeagues.push(element);
                });

                var index = 1;
                data.LeaderboardRankings.forEach(element => {

                    if (spaceLessLeagues.indexOf(element.GameMode) >= 0) {

                        responseObj.frames.push({
                            'index': index,
                            'text': element.GameMode,
                            'icon': null,
                        });
                        index++;
                        // switch (element.GameMode) {
                        //     case "QuickMatch":
                        //         frame.text = "QM";
                        //         break;
                        //     case "HeroLeague":
                        //         frame.text = "HeroL";
                        //         break;
                        //     case "TeamLeague":
                        //         frame.text = "TeamL";
                        //         break;
                        //     case "UnrankedDraft":
                        //         frame.text = "URD";
                        //         break;

                        // }
                        var frame = {
                            'index': index,
                            'text': "",
                            'icon': null,
                        };
                        switch (element.LeagueID) {
                            case 0:
                                frame.icon = iconValues.master;
                                frame.text = "Master";
                                break;
                            case 1:
                                frame.icon = iconValues.diamond;
                                frame.text = "Diams";
                                break;
                            case 2:
                                frame.icon = iconValues.platinum;
                                frame.text = "Plat";
                                break;
                            case 3:
                                frame.icon = iconValues.gold;
                                frame.text = "Gold";
                                break;
                            case 4:
                                frame.icon = iconValues.silver;
                                frame.text = "Silver";
                                break;
                            case 5:
                                frame.icon = iconValues.bronze;
                                frame.text = "Bronze";
                                break;
                        }
                        responseObj.frames.push(frame);
                        index++;
                    }
                });

                resolve(responseObj);
            }
        });
    },

    /**
     * Method: buildEthResponse
     * @return json
     * returns LaMetric readable Json
     */
    buildEthResponse: function(req, walletBalance) {
        return new Promise(function(resolve, reject) {
            // Building object for LaMetric. We will return it
            var responseObj = {};
            responseObj.frames = [];
            index = 0;

            responseObj.frames.push(jsonValues.walletIntroFrame);
            var walletFrame = {
                'index': 1,
                'text': walletBalance,
                'icon': iconValues.ethSymbol,
            };
            responseObj.frames.push(walletFrame);

            var balanceFiatSymbol = req.query.balance_value;
            var params = {
                coin: "ETH",
                currency: balanceFiatSymbol,
                query: req.query
            };

            return CryptoApi.getCoinChange(req.headers, params).then(function(data) {
                console.log("----------CryptoApi.getCoinChange-");
                console.log(data);
                if (!data) {
                    reject(new Error("LaMetric.getCoinChange - No data found"));
                } else {

                    // console.log("nanoBalance=" + nanoBalance);
                    // console.log("req.query.balance_value=" + balanceFiatSymbol);
                    var coinValinFiat = data[balanceFiatSymbol];
                    var balanceValue = walletBalance * coinValinFiat;
                    balanceValue = Number((balanceValue).toFixed(2));

                    var fiatIcon = "i34";
                    switch (balanceFiatSymbol) {
                        case 'EUR':
                            fiatIcon = 'i3213'; // Euro icon i3213
                            break;
                        case 'USD':
                            fiatIcon = 'i34'; // Dollar icon i34
                            break;
                        case 'BTC':
                            fiatIcon = 'i12460'; // Bitcoin icon i12460
                            break;
                    }

                    var balanceValueFrame = {
                        'index': 2,
                        'text': balanceValue,
                        'icon': fiatIcon,
                    };
                    // console.log("balanceValue=" + balanceValue);
                    // console.log(balanceValueFrame);
                    responseObj.frames.push(balanceValueFrame);
                    resolve(responseObj);
                }
            }).catch(function(err) {
                console.log("Error buildEthResponse");
                console.log(err);
            });

        });
    },

    /**
     * Method: buildNanoResponse
     * @return json
     * returns LaMetric readable Json
     */
    buildNanoResponse: function(req, dataResp) {

        return new Promise(function(resolve, reject) {
            // Building object for LaMetric. We will return it
            var responseObj = {};
            responseObj.frames = [];
            index = 0;

            // console.log();
            // console.log("dataResp.data.balance=" + dataResp.data.balance);

            if (dataResp == undefined) {
                reject(new Error("LametricApi.buildNanoResponse No data found"));
            } else if (dataResp.data == undefined) {

                var jsonResp = JSON.parse(dataResp);
                console.log(jsonResp.frames);
                if (jsonResp.frames) {
                    resolve(jsonResp);
                } else {

                }
            } else {

                var nanoBalance = dataResp.data.balance;
                var balanceFrame = {
                    'index': index,
                    'text': nanoBalance,
                    'icon': 'i11861',
                };
                responseObj.frames.push(balanceFrame);
                index++;

                //var balanceFiatSymbol = "";

                var balanceFiatSymbol = req.query.balance_value;
                var params = {
                    coin: "ETH",
                    currency: balanceFiatSymbol,
                    query: req.query
                        /*,
                                            headers: req.headers*/
                };

                return CryptoApi.getCoinChange(req.headers, params).then(function(data) {
                    console.log();
                    if (!data) {
                        reject(new Error("NanoPoolApi.getCoinChange - No data found"));
                    } else {

                        // console.log("nanoBalance=" + nanoBalance);
                        // console.log("req.query.balance_value=" + balanceFiatSymbol);
                        var coinValinFiat = data[balanceFiatSymbol];
                        var balanceValue = nanoBalance * coinValinFiat;
                        balanceValue = Number((balanceValue).toFixed(2));

                        var fiatIcon = "i34";
                        switch (balanceFiatSymbol) {
                            case 'EUR':
                                fiatIcon = 'i3213'; // Euro icon i3213
                                break;
                            case 'USD':
                                fiatIcon = 'i34'; // Dollar icon i34
                                break;
                        }

                        var balanceValueFrame = {
                            'index': index,
                            'text': balanceValue.toString(),
                            'icon': fiatIcon,
                        };
                        // console.log("balanceValue=" + balanceValue);
                        // console.log(balanceValueFrame);
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
                                    frame.text = hashrate;
                                    frame.icon = "i17329"; // Hrate icon
                                    break;
                                case "AvgHash1h":
                                    frame.text = h1hashrate;
                                    frame.icon = "i17335"; // H1 icon
                                    break;
                                case "AvgHash3h":
                                    frame.text = h3hashrate;
                                    frame.icon = "i17336"; // H3 icon
                                    break;
                                case "AvgHash6h":
                                    frame.text = h6hashrate;
                                    frame.icon = "i17332"; // H6 icon
                                    break;
                                case "AvgHash12h":
                                    frame.text = h12hashrate;
                                    frame.icon = "i17333"; // H12 icon
                                    break;
                                case "AvgHash24h":
                                    frame.text = h24hashrate;
                                    frame.icon = "i17334"; // H24 icon
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