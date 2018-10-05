const discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('bot-config.json'));
const admin = require('./admin.js');
const conversation = require('./conversation.js');
const e = require('./echo.js');



function init(ech) {
  const client = new discord.Client();
  const echo = ech ? ech : new e.Echo();

  client.on('ready', function(){
    echo.app = {
      client: client,
      admin: null,
      server: config.SERVER ? client.guilds.get(config.SERVER) : null,
    }
    echo.addConversation(new conversation.DiscordConversation(client.channels.get(config.CHANNEL), client.user.id));
    //echo.addAdmin(new admin.ConsoleAdminInterface());

    console.log("Discord Client ready");
  });

  var initialized = false;
  client.on('message', function(message){
    if (message.channel.type == 'dm' && message.author.id == config.USER && !initialized) {
      echo.addAdmin(new admin.DiscordAdminInterface(message.channel, config.USER));
      message.channel.send("Admin channel initialized");
      initialized = true;
    }
  });
  client.login(config.DISCORD_TOKEN);
}

init()

module.exports = {
  init: init
}
