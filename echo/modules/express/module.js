const express = require('express');
const admin = require('./admin.js');

function init(e) {
  //Initialize express server
  const app = express();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.static(__dirname + '/webserver/public'));

  //handle logging
  const logs = [];
  function pushLog(logMessage) {
    logs.push(logMessage);
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
    response.sendFile(__dirname + "/../../logs/log.txt");
  });


  const sockets = [];
  const interface = (new admin.ExpressAdminInterface(app, pushLog));
  e.addAdmin(interface);

  io.on('connection', function(socket){
    sockets.push(socket);
    interface.addSocket(socket);
  });

  app.get('/', function(request, response) {
    response.sendFile(__dirname + '/webserver/views/echo.html');
  });

  const port = 5000;
  http.listen(port, function() {
    console.log('Your app is listening on port ' + port);
  });
}

module.exports = init;
