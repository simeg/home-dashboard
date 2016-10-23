'use strict';

var express = require('express');
var app = express();
var http = require('http');
var utils = require('./utils.js');
var logger = utils.logger();
var config = Object.freeze(require('./config.json'));

app.use(express.static('views'));
app.set('view engine', 'pug');

// TODO: Clean this up
var metroConfig = config.metro;
metroConfig.API_PATH = metroConfig.API_PATH + '?key=' + metroConfig.API_KEY +
    '&siteid=' + metroConfig.STATION_ID + '&timewindow=' + metroConfig.TIME_WINDOW;
metroConfig.PARSER = parseMetroData;
metroConfig = Object.freeze(metroConfig);

// TODO: Clean this up
var weatherConfig = config.weather;
weatherConfig.PARSER = parseWeatherData;
weatherConfig.API_PATH = weatherConfig.API_PATH + '?id=' + weatherConfig.COUNTRY_ID +
    '&appid=' + weatherConfig.API_KEY + '&units=' + weatherConfig.UNITS;
// Temp
weatherConfig = Object.freeze(weatherConfig);

app.get('/', function (req, res) {
    // Ugly solution to make double call work
    var metroData, weatherData,
        errors = [];
    fetchData(weatherConfig, function(error, data) {
        if (error) {
            logger.log(error.type, error.msg, { calledBy: error.from });
            errors.push(error);
        }

        // We continue even if error happened to collect them all (gotta catch 'em all)
        weatherData = data;
        fetchData(metroConfig, function(error, data) {
            if (error) {
                logger.log(error.type, error.msg, { calledBy: error.from });
                errors.push(error);
            }

            metroData = data;
        });
    });

    var render = function() {
        var errorsExist = (errors && errors.length);
        if ((metroData && weatherData) || errorsExist) {
            var date = utils.getDateObject();
            var uniqueErrors = errorsExist ? utils.filterDeepArray(errors) : null;
            res.render('index', { weather: weatherData, metro: metroData,
                errors: uniqueErrors, date: date });
            clearInterval(id);
        }
    };

    var id = setInterval(render, 1000);
});

app.listen(3000, function () {
    console.log('Express server is available on: http://localhost:3000');
});

function fetchData(config, callback) {
    if (!config || !callback){
        callback({ type: 'error', msg: 'Missing one or more parameters', from: 'fetchData' });
        return;
    }

    http.get({
        host: config.API_HOST,
        path: config.API_PATH
    }, function(response) {
        var body = '';
        response.on('data', function(data) {
            body += data;
        });
        response.on('end', function() {
            response.setEncoding('utf8');

            if (response.statusCode !== 200) {
                callback({ type: 'error',
                    msg: 'Invalid status code returned (' + response.statusCode + ')',
                    from: 'fetchData' });
                return;
            }

            var jsonBody = '';
            try {
                jsonBody = JSON.parse(body);
            } catch (error) {
                callback({ type: 'error', msg: error.message, from: 'fetchData' });
                return;
            }

            var parsed = config.PARSER(jsonBody, config);
            callback(parsed.errors, parsed.data);
        });
    }).on('error', function(error) {
        callback({ type: 'error', msg: error.message });
    });
}

function parseMetroData(rawData, config) {
    if (!rawData || !config)
        return { data: null,
            errors: { type: 'error', msg: 'Missing one or more parameters',
                from: 'parseMetroData' }};

    var data = rawData;
    var stationStr = utils.toPascalCase(config.STATION_NAME);
    var journeys = data.ResponseData.Metros;

    var stationExist = journeys.some(function(journey) {
        return journey.StopAreaName === stationStr;
    });

    if (!stationExist)
        return { data: null,
            errors: { type: 'error', msg: 'Station does not exist in data: ' + stationStr,
                from: 'parseMetroData' }};

    data = journeys.map(function(journey) {
        if (journey.DisplayTime.toLowerCase() === config.TIME_NOW) {
            journey.status = config.TIME_NOW_CSS;
        } else {
            var time = parseInt(journey.DisplayTime, 10);

            if (time <= parseInt(config.TIME_TOO_LATE, 10)) {
                journey.status = config.TIME_TOO_LATE_CSS;
            } else if (time > parseInt(config.TIME_TOO_LATE, 10) &&
                time <= parseInt(config.TIME_HURRY, 10)) {
                journey.status = config.TIME_HURRY_CSS;
            } else {
                journey.status = config.TIME_SAFE_CSS;
            }
        }

        return journey;
    });

    return { data: data, errors: null };
}

function parseWeatherData(rawData, config) {
    if (!rawData || !config) {
        return { data: null, errors: { type: 'error',
            msg: 'Missing one or more parameters', from: 'parseWeatherData' }};
    }

    var data = rawData;
    data.main.temp = Math.round(data.main.temp);

    // Set icon url for all weather elements
    data.weather = rawData.weather.map((function(item) {
        item.iconUrl = weatherConfig.ICON_URL + item.icon + '.png';
        return item;
    }));

    return { data: data, errors: null };
}
