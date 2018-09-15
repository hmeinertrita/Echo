const discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const admin = require('./admin.js');
const conversation = require('./conversation.js');
const e = require('./echo.js');

const client = new discord.Client();
const echo = new e.Echo();

client.on('ready', function(){
  echo.app = {
    client: client,
    admin: null,
    server: config.SERVER ? client.guilds.get(config.SERVER) : null,
  }
  echo.addConversation(new conversation.Conversation(client.channels.get(config.CHANNEL)));
  echo.addAdmin(new admin.ConsoleAdminInterface());

  console.log("Discord Client ready");
});

// client.on('message', function(message){
//   if (message.channel.type == 'dm' && message.author.id == config.USER && mess == 'init') {
//     echo.addAdmin(new admin.DiscordAdminInterface(message.channel, config.USER));
//   }
// });

client.login(config.DISCORD_TOKEN);
