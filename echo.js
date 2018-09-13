const discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const readline = require('readline');
const commands = require('./commands.js');

const client = new discord.Client();
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var app;

input.on('line', (input) => {
  const command = commands.parse(input);
  if(command) {
    app = command(app, input.replace(/^\S* /, ""));
  }
  else {
    app.channel.send(input);
  }
});

function init(token) {
  client.on('ready', function(){
    app = {
      client: client,
      admin: null,
      adminChannel: null,
      channel: config.CHANNEL ? client.channels.get(config.CHANNEL) : null,
      server: config.SERVER ? client.guilds.get(config.SERVER) : null,
    }
    console.log("Discord Client ready");
  });

  client.on('message', function(message){
    const mess = message.cleanContent.replace("@" + client.user.username + " ", "");

    if (message.channel.type == 'dm' && message.author.id == config.USER) {

      if (!app.adminChannel) {
        app.adminChannel=message.channel;
        commands.log(app, "initialized admin channel!");
      }

      if (!app.admin) {
        app.admin=message.author;
        commands.log(app, "initialized admin!");
      }

      const command = commands.parse(mess);
      if (command) {
        app = command(app, mess.replace(/^\S* /, ""));
      }
      else {
        app.channel.send(mess);
      }
    }
    else if (app.channel && message.channel.id == app.channel.id) {
      commands.log(app, message.member.nickname + ": " + mess);
    }
    else if (message.author.id != client.user.id){
      commands.log(app, '#' + message.channel.name + '@' + message.member.nickname + ": " + mess);
    }

  });

  client.login(token);
}

init(config.DISCORD_TOKEN);
