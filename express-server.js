const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot.js');
const admin = require('./admin.js');
const conversation = require('./conversation.js');
const e = require('./echo.js');



const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
  echo.addAdmin(new admin.ExpressAdminInterface(socket, app, '/echo', '/messages'));
});

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('webserver/public'));

const echo = new e.Echo();
console.log('Initializing Discord Bot...');
bot.init(echo);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/webserver/views/echo.html');
});

// listen for requests :)
const port = 5000;
http.listen(port, function() {
  console.log('Your app is listening on port ' + port);
});
