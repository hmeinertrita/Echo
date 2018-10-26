const echo = require('./echo/echo.js');
const discord = require('./echo/modules/discord/module.js');
const express = require('./echo/modules/express/module.js');

const e = new echo({
  initializeConsole: true,
  profile: 'echo',
  modules: [discord, express]
});
