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

var app = {
  client: client,
  channel: null,
  server: null,
}

input.on('line', (input) => {
  app.channel.send(input);
});

function init(token) {
  client.on('ready', function(){
    broadcast = client.createVoiceBroadcast();
    console.log("Discord Client ready");
  });

  client.on('message', function(message){
    const mess = message.cleanContent.replace("@" + client.user.username + " ", "");

    if (message.channel.type == 'dm' && message.author.id == config.USER) {
      command = commands.parse(mess);
      if (command) {
        app = command(app, mess.replace(/^\S* /, ""));
      }
    }
    else if (app.channel && message.channel.id == app.channel.id) {
      console.log(message.member.nickname + ": " + mess);
    }
    else if (message.author.id != client.user.id){
      console.log(message.member.nickname + '@' + message.channel.name + ": " + mess);
    }

  });

  client.login(token);
}

init(config.DISCORD_TOKEN);
