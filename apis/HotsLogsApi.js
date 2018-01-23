/*jshint esversion: 6 */
var jsonApi = require("./JsonApi");
module.exports = {

    getPlayerStats: function(headers, parameters) {

        var regionCode = "0";
        var battleTag = parameters.battleTag + "_" + parameters.battleTagNumber;
        switch (parameters.Region) {
            case "US":
                regionCode = "1";
                break;
            case "EU":
                regionCode = "2";
                break;
            case "KR":
                regionCode = "4";
                break;
            case "CN":
                regionCode = "5";
                break;
        }

        var url = "https://api.hotslogs.com/Public/Players/" + regionCode + "/" + battleTag;

        return jsonApi.getData(url, headers, parameters);
    },
}