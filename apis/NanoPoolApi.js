var request = require('request');
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

        console.log(url);
        var postHeader = {
            'User-Agent': headers.host,
            'Accept': 'application/json',
            'Authorization': headers.authorization // pass authorization header received in request
        };
        this.getData(url, postHeader, parameters, callback);

    },
};