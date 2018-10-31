const echo = require('./echo/echo.js');
const discordModule = require('./echo/modules/discord/module.js');
const expressModule = require('./echo/modules/express/module.js');
const express = require('express');

const e = new echo({
  initializeConsole: true,
  profile: 'echo',
  modules: ["discord"]
});

const app = express();
app.use(express.static(__dirname+'/webserver/public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname+'/webserver/views/echo.html');
});

expressModule(e, app);
