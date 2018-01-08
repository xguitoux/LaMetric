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
    buildNanoResponse: function(req, data) {

        // Building object for LaMetric. We will return it
        var responseObj = {};
        responseObj.frames = [];

        index = 0;
        console.log(data);

        if (!data) {
            return false;
        } else {

            var frame = {
                'index': index,
                'text': data.data,
                'icon': 'i11861',
            };

            responseObj.frames.push(frame);

            return responseObj;
        }
    },
};