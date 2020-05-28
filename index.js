const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var port = process.env.PORT || 3000;

app.get('/',  function(req, res) {
  res.send('done');
});

///////////////////
///// Webhook /////
//////////////////
app.post('/webhook', function(req, res) {
  console.log('Received a post message');
  if (!req.body) return res.sendStatus(400);
  res.setHeader('Content-Type',  'application/json');
  console.log('Here is the post request from dialogflow');
  console.log(req.body);
  console.log('Got geo-city parameter from dialogflow ' + req.body.queryResult.parameters['geo-city']);
    var city = req.body.queryResult.parameters['geo-city'];
    var w = getWeather(city);
    let response = " ";
    let  responseObj = {
      "fulfillmentText": response,
      "fulfillmentMessages": [{ "text": { "text": ["Text response from webhook"]}}],
      "source":""
    };
    console.log('Here is the response to dialogflow');
    console.log(responseObj);
    return res.json(responseObj);
});


/****** Weather  API *********/
var apiKey = 'd3105c44f56ccd8f5e0d4fdf87de5cf5';
var result;

function  callback(error, response, body) {
  if (error) {
    console.log('error', error);
  }
    var jsonObj = JSON.parse(body);
    if (jsonObj.message === 'city  not found') {
      result = "Unable to get weather " + jsonObj.message;
    } else {
      result = "Right now it is  " + jsonObj.main.temp  + " degrees with " + jsonObj.weather[0].description;
    }
}

function getWeather(city) {
  result = undefined;
  var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
  console.log(url);
  var req =  request(url, callback);
    while (result === undefined) {
      require('deasync').runLoopOnce();
    }
  return result;
}

app.listen(port);
