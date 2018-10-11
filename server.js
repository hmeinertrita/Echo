const echo = require('./echo/echo.js');
const discord = require('./echo/modules/discord/module.js');
const express = require('./echo/modules/express/module.js');

const e = new echo(true);
e.loadModule(discord);
e.loadModule(express);
