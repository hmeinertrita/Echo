const discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const interfaces = require('./interfaces.js');
const echoer = require('./echo.js');

const client = new discord.Client();
const echo = new echoer.Echo();

client.on('ready', function(){
  echo.app = {
    client: client,
    admin: null,
    adminChannel: null,
    channel: config.CHANNEL ? client.channels.get(config.CHANNEL) : null,
    server: config.SERVER ? client.guilds.get(config.SERVER) : null,
  }
  echo.addInterface(new interfaces.ConsoleAdminInterface());

  console.log("Discord Client ready");
});

client.on('message', function(message){
  const mess = message.cleanContent.replace("@" + client.user.username + " ", "");

  if (message.channel.type == 'dm' && message.author.id == config.USER && mess == 'init') {
    echo.addInterface(new interfaces.DiscordAdminInterface(message.channel, config.USER));
  }
  else if (message.author.id != client.user.id && echo.app.channel && message.channel.id == echo.app.channel.id) {
    echo.log(message.member.nickname + ": " + mess);
  }
  //else if (message.author.id != client.user.id){
  //  echo.log('#' + message.channel.name + '@' + message.member.nickname + ": " + mess);
  //}

});

client.login(config.DISCORD_TOKEN);
