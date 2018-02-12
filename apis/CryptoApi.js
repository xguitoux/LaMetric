/*jshint esversion: 6 */
var JsonApi = require("./JsonApi");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://api.myetherapi.com/eth"));


module.exports = {

    getEthBalance: function(headers, parameters) {

        return new Promise(function(resolve, reject) {
            // console.log(web3.currentProvider);

            web3.eth.getBalance(parameters.wallet, function(error, result) {
                if (!error) {
                    var walletBalance = web3.fromWei(result, 'ether').toNumber();
                    resolve(walletBalance);
                } else {
                    console.error(error);
                    reject(new Error("CryptoApi.getEthBalance - No data found"));
                }
            });
        });
    },
    getCoinChange: function(headers, parameters) {
        var url = " https://min-api.cryptocompare.com/data/price?fsym=" + parameters.coin + "&tsyms=" + parameters.currency;

        return JsonApi.getData(url, headers, parameters);
    },
    isValidEthWallet(wallet) {
        return web3.isAddress(wallet);
    }
};