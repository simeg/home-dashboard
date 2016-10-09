var express = require('express');
var app = express();
var http = require('http');
var config = Object.freeze(require('./config.json'));

app.set('view engine', 'pug');

// TODO: Clean this up
var metroConfig = config.metro;
metroConfig.API_PATH = metroConfig.API_PATH + '?key=' + metroConfig.API_KEY +
      '&siteid=' + metroConfig.STATION_ID + '&timewindow=' + metroConfig.TIME_WINDOW;
metroConfig.PARSE_FUNC = getMetroData;
metroConfig = Object.freeze(metroConfig);

// TODO: Clean this up
var weatherConfig = config.weather;
weatherConfig.PARSE_FUNC = getWeatherData;
weatherConfig.API_PATH = weatherConfig.API_PATH + '?id=' + weatherConfig.COUNTRY_ID +
      '&appid=' + weatherConfig.API_KEY + '&units=' + weatherConfig.UNITS;
// Temp
weatherConfig = Object.freeze(weatherConfig);

app.get('/', function (req, res) {
    // Ugly solution to make double call work
    var metroData, weatherData;
    fetchData(weatherConfig, function(error, data) {
        if (error)
            return console.error(error);

        weatherData = data;
        fetchData(metroConfig, function(error, data) {
            if (error)
                return console.error(error);

            metroData = data;
        });
    });

    var render = function() {
        if (metroData && weatherData) {
            res.render('index', { weather: weatherData, metro: metroData });
            clearInterval(id);
        }
    };

    var id = setInterval(render, 1000);
});

app.listen(3000, function () {
    console.log('Express server is available on: http://localhost:3000');
});

function fetchData(config, callback) {
    if (!config || !callback)
        return console.error('Missing one or more parameters');

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

            if (response.statusCode !== 200)
                return console.log('Invalid Status Code Returned:', response.statusCode);

            var jsonBody = '';
            try {
                jsonBody = JSON.parse(body);
            } catch (error) {
                console.error('Unable to parse response as JSON:', error);
                callback(error);
            }

            var parsedData = config.PARSE_FUNC(jsonBody, config);
            callback(null, parsedData);
        });
    }).on('error', function(error) {
        console.error('Error with the request:', error.message);
        callback(error);
    });
}

function getMetroData(data, config) {
    if (!data || !config)
        return console.log('One or more parameters are missing');

    var stationStr = toPascalCase(config.STATION_NAME);
    var journeys = data['ResponseData']['Metros'];

    var stationExist = journeys.some(function(journey) {
        return journey['StopAreaName'] === stationStr;
    });

    if (!stationExist)
        return console.log('Station does not exist in data:', stationStr);

    return journeys.map(function(journey) {
        if (journey['DisplayTime'].toLowerCase() === config.TIME_NOW) {
            journey['status'] = config.TIME_NOW_CSS;
        } else {
            var time = parseInt(journey['DisplayTime']);

            if (time <= parseInt(config.TIME_TOO_LATE)) {
                journey['status'] = config.TIME_TOO_LATE_CSS;
            } else if (time > parseInt(config.TIME_TOO_LATE) &&
                  time <= parseInt(config.TIME_HURRY)) {
                journey['status'] = config.TIME_HURRY_CSS;
            } else {
                journey['status'] = config.TIME_SAFE_CSS;
            }
        }

        return journey;
    });
}

function getWeatherData(data, config) {
    if (!data || !config)
        return console.log('One or more parameters are missing');

    data.main.temp = Math.round(data.main.temp);

    // Add icon url for all weather elements
    for (var i = 0; i < data.weather.length; i++) {
        var weatherObj = data.weather[i];
        weatherObj.iconUrl =
              weatherConfig.ICON_URL + weatherObj.icon + '.' + weatherConfig.ICON_EXTENSION;
    }

    return data;
}

function toPascalCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function fahrenheitToCelsius(temp) {
    return ((5.0 / 9.0) * (temp - 32));
}
