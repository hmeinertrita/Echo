const express = require('express');
const admin = require('./admin.js');
const commands = require('./commands.js')('/webserver/public/images');

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
  app.post('/add', (req, res) => {
    e.commandCenter.invoke('add-channel', e, req.body.id);
  });
  app.get('/recentlogs', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      logs: logs
    });
  });
  app.get('/conversations', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      convos: e.conversations.map(c => {
        return c.name;
      })
    });
  });
  app.post('/setconversation', (req, res) => {
    e.setCurrentConversation(req.body.id);
  });
  app.get('/logs', function(request, response) {
    response.sendFile(__dirname + "/../../logs/log.txt");
  });


  const sockets = [];
  const interface = (new admin.ExpressAdminInterface(app, pushLog));
  e.addAdmin(interface);
  e.loadCommand(...commands);
  e.commandCenter.commands['profile'].addCommand(e.commandCenter.commands['copy-avatar']);
  e.commandCenter.commands['profile'].addCommand(e.commandCenter.commands['socket-profile']);

  io.on('connection', function(socket){
    sockets.push(socket);
    interface.addSocket(socket);
    commands.forEach(command => {
      if (command.addSocket) {
        command.addSocket(socket);
      }
    });
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
