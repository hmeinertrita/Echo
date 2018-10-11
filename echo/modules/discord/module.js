const discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands.js');
const config = process.argv[2] !== 'glitch' ? JSON.parse(fs.readFileSync(__dirname + '/config.json')) : {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  USER: process.env.USER,
  SERVER: process.env.SERVER,
  CHANNEL: process.env.CHANNEL,
};
const admin = require('./admin.js');
const conversation = require('./conversation.js');



function init(e) {
  const client = new discord.Client();
  const echo = e;

  client.on('ready', function(){
    const discordCommands = commands(client, config.SERVER ? client.guilds.get(config.SERVER) : null);
    echo.loadCommand(...discordCommands);
    echo.commandCenter.commands['profile'].addCommand(echo.commandCenter.commands['discord-profile']);
    echo.addConversation(new conversation.DiscordConversation(client.channels.get(config.CHANNEL), client.user.id));

    echo.log("Discord Client ready");
  });

  var initialized = false;
  client.on('message', function(message){
    if (message.channel.type == 'dm' && message.author.id == config.USER && !initialized) {
      echo.addAdmin(new admin.DiscordAdminInterface(message.channel, config.USER));
      message.channel.send("Admin channel initialized");
      initialized = true;
    }
  });
  client.login(config.DISCORD_TOKEN).catch(error => {e.log(`Couldn't log into Discord because ${error}`)});
}

module.exports = init;
