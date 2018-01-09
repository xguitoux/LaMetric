/*jshint esversion: 6 */
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

            var balanceFrame = {
                'index': 0,
                'text': dataResp.data.balance,
                'icon': 'i11861',
            };
            responseObj.frames.push(balanceFrame);
            index++;


            if (req.query.balance_value != null) {
                console.log("balance_value=" + req.query.balance_value);
                var balanceValue = NanoPoolApi.getCoinChange(header, parameters, callback);
                // Dollar icon i34
                // Euro icon i3213
                var balanceValueFrame = {
                    'index': index,
                    'text': balanceValue,
                    'icon': 'i34',
                };
                responseObj.frames.push(balanceValueFrame);
                index++;
            }


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

                    //if (element.e)


                    index++;
                    responseObj.frames.push(frame);
                });
            }


            return responseObj;
        }
    },
};