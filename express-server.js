const express = require('express');
const bot = require('./bot.js');
const admin = require('./admin.js');
const conversation = require('./conversation.js');
const e = require('./echo.js');
const fs = require('fs');


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('webserver/public'));

const logs = [];
var stream = fs.createWriteStream("webserver/log.txt", {flags:'a'});
function pushLog(logMessage) {
  logs.push(logMessage);
  stream.write((new Date()).toUTCString() + " ------ " + logMessage + "\n");
}
app.post('/log', (req, res) => {
  pushLog(req.body.mess);
});
app.get('/recentlogs', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    logs: logs
  });
});
app.get('/logs', function(request, response) {
  response.sendFile(__dirname + '/webserver/log.txt');
});


const echo = new e.Echo();
const sockets = [];
const interface = (new admin.ExpressAdminInterface(app, pushLog));
echo.addAdmin(interface);

io.on('connection', function(socket){
  sockets.push(socket);
  interface.addSocket(socket);
});

console.log('Initializing Discord Bot...');
bot.init(echo);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/webserver/views/echo.html');
});

const port = 5000;
http.listen(port, function() {
  console.log('Your app is listening on port ' + port);
});
