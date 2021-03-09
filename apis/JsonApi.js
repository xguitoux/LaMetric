var rp = require('request-promise');
module.exports = {
    /**
     * Method: getData
     * @return json
     * returns Response called API method
     */
    getData: function(url, p_headers, queryParams) {

        var options = {
            uri: url,
            headers: {
                'User-Agent': p_headers.host,
                'Accept': 'application/json',
                'Authorization': p_headers.authorization // pass authorization header received in request
            },
            json: true // Automatically stringifies the body to JSON
        };
        return rp(options).promise().then(function(jsonBody) {
            return jsonBody;

        }).catch(function(error) {
            console.log("JsonApi.getData CATCH");
            console.log(error);
        });
    },

};