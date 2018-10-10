const discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands.js');
const config = process.argv[2] !== 'glitch' ? JSON.parse(fs.readFileSync('bot-config.json')) : {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  USER: process.env.USER,
  SERVER: process.env.SERVER,
  CHANNEL: process.env.CHANNEL,
};
const admin = require('./admin.js');
const conversation = require('./conversation.js');
const e = require('./echo.js');



function init(ech) {
  const client = new discord.Client();
  const echo = ech ? ech : new e.Echo();

  client.on('ready', function(){
    echo.loadCommand(...commands.discordCommands(client, config.SERVER ? client.guilds.get(config.SERVER) : null));
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

//init()

module.exports = {
  init: init
}
