var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    http = require('http'),
    app = express(),
    HotsLogApi = require('./apis/HotsLogsApi'),
    LaMetricApi = require('./apis/LaMetricApi'),
    NanoPoolApi = require('./apis/NanoPoolApi'),
    moment = require('moment');

var port = process.env.PORT || 8080,
    ip = process.env.IP || '0.0.0.0';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/env', function(req, res) {
    console.log(process.env);
});

// HotsLogs app
app.get('/HotsLogs', function(req, res) {
    console.log(req.query);
    HotsLogApi.getPlayerStats(req.headers, req.query, function(err, response, data) {
        if (err || response.statusCode != 200) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            } else {
                return res.status(response.statusCode).send(response.body);
            }
        }

        var jsonResponse = LaMetricApi.buildResponse(req, data);

        if (!jsonResponse) {
            console.log("Error HotsLogs: ", response.statusCode);
            res.status(response.statusCode).send(response.body);
        } else {
            console.log("Response HotsLogs: ", jsonResponse);
            return res.status(200).json(jsonResponse);
        }
    });

});

app.get('/NanoPool', function(req, res) {
    console.log();
    console.log("------------- NanoPool request at " + moment().format());
    console.log(req.query);

    NanoPoolApi.getMiningStats(req.headers, req.query).then(function(jsonMiningStats) {

        return LaMetricApi.buildNanoResponse(req, jsonMiningStats).then(function(jsonResponse) {

            console.log("To LaMetric : ", jsonResponse);
            console.log();
            return res.status(200).json(jsonResponse);
        });

    }).catch(function(err) {
        console.log("-----CATCH--------");
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
console.log("~~~~~~~~~~~~~~");
console.log("LaMetric apps v2.0beta");
console.log("Nanopool app v4.0beta");
console.log('Server running on http://%s:%s', ip, port);
console.log("~~~~~~~~~~~~~~");

module.exports = app;