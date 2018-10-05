const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot.js');
const admin = require('./admin.js');
const conversation = require('./conversation.js');
const e = require('./echo.js');



const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('webserver/public'));

const echo = new e.Echo();
bot.init(echo);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/webserver/views/echo.html');
});

echo.addAdmin(new admin.ExpressAdminInterface(app, '/echo'));

// listen for requests :)
var listener = app.listen(5000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
