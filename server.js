var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    http = require('http'),
    app = express(),
    HotsLogApi = require('./apis/HotsLogsApi'),
    LaMetricApi = require('./apis/LaMetricApi'),
    NanoPoolApi = require('./apis/NanoPoolApi'),
    CryptoApi = require('./apis/CryptoApi'),
    moment = require('moment'),
    jsonValues = require('./consts/jsonValues'),
    session = require('express-session');

var port = process.env.PORT || 8080,
    ip = process.env.IP || '0.0.0.0';

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/env', function(req, res) {
    console.log(process.env);
});

// HotsLogs app
app.get('/HotsLogs', function(req, res) {
    console.log();
    console.log("------------- HotsLogs request at " + moment().format());
    console.log(req.query);
    console.log("------------------------------------------");

    // Default display in App Store
    if (isEmptyObject(req.query)) {

        res.status(200).json(JSON.parse(jsonValues.defaultHots));
    } else {

        HotsLogApi.getPlayerStats(req.headers, req.query).then(function(jsonHots) {

            return LaMetricApi.buildHotsResponse(req, jsonHots).then(function(jsonResponse) {
                console.log("To LaMetric HotsLogs : ", jsonResponse);
                console.log();
                return res.status(200).json(jsonResponse);
            });

        }).catch(function(err) {
            console.log("-----HotsLogs CATCH--------");
            console.log(err);
        });
    }
});

app.get('/EthWallet', function(req, res) {
    console.log();
    console.log("------------- EthWallet request at " + moment().format());
    console.log(req.query);
    console.log("------------------------------------------");

    //console.log(req.query.wallet);
    if (isEmptyObject(req.query)) {
        return res.status(200).json(JSON.parse(jsonValues.defaultEthWallet));
    } else
    if (CryptoApi.isValidEthWallet(req.query.wallet)) {

        CryptoApi.getEthBalance(req.headers, req.query).then(function(walletBalance) {
            return LaMetricApi.buildEthResponse(req, walletBalance).then(function(jsonResponse) {
                console.log("To LaMetric EthWallet : ", jsonResponse);
                console.log();
                return res.status(200).json(jsonResponse);
            });

        }).catch(function(err) {
            console.log("-----EthWallet CATCH--------");
            console.log(err);
        });
    } else {
        return res.status(200).json(JSON.parse(jsonValues.errorEthWallet));
    }
});

app.get('/NanoPool', function(req, res) {

    console.log();
    console.log("------------- NanoPool request at " + moment().format());
    console.log(req.query);
    console.log("------------------------------------------");

    NanoPoolApi.getMiningStats(req.headers, req.query).then(function(jsonMiningStats) {

        // console.log();
        // console.log("-----++++++++++++++--------");
        // console.log(jsonMiningStats);
        // console.log("-----++++++++++++++--------");
        // console.log();
        return LaMetricApi.buildNanoResponse(req, jsonMiningStats).then(function(jsonResponse) {
            console.log("To LaMetric NanoPool : ", jsonResponse);
            console.log();
            return res.status(200).json(jsonResponse);
        });

    }).catch(function(err) {
        console.log("-----NanoPool CATCH--------");
        console.log(err);
    });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    res.json({ error: err });
});

app.listen(port, ip);
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("LaMetric  apps v2.0");
console.log("Nanopool  app v4.0beta");
console.log("HotsLogs  app v3.0");
console.log("EthWallet app v1.0");
console.log('Server running on http://%s:%s', ip, port);
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

module.exports = app;