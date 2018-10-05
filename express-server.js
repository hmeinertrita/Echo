// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('webserver/public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + 'webserver/views/echo.html');
});

// listen for requests :)
var listener = app.listen(5000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
