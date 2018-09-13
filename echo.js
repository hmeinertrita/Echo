const discord = require('discord.js');
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync('tokens.json'));
const readline = require('readline');

const client = new discord.Client();
const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var currentChannel;

input.on('line', (input) => {
  currentChannel.send(input);
});

function init(token) {
  client.on('ready', function(){
    broadcast = client.createVoiceBroadcast();
    console.log("Discord Client ready");
  });

  client.on('message', function(message){
    var mess = remove(client.user.username, message.cleanContent);
    if (mess.startsWith('load')) {
      var status = loadProfile(mess.replace("load ", ""), message.guild);
      message.reply(status);
    }
    if (mess.startsWith('join')) {
      const id = mess.replace("join ", "");
      currentChannel = client.channels.get(id);
      currentChannel.send("I'm here now!");
    }
    else {
      console.log(message.member.nickname+": "+mess);
    }
  });

  client.login(token);
}

function remove(username, text){
  return text.replace("@" + username + " ", "");
}

function loadProfile(profileName, server) {
  const path = "./profiles/" + profileName + '/';
  const profile = JSON.parse(fs.readFileSync(path + 'profile.json'));
  client.user.setAvatar(path + profile.avatar);
  server.me.setNickname(profile.nickname);
  var status = "Profile " + profileName + " loaded!";
  return status;
}

init(tokens.DISCORD_TOKEN);
