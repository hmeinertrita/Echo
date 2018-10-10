const fs = require('fs');

class CommandCenter {
  constructor(...commands) {
    this.commands={};
    this.invokers=[];
    this.addCommand(commands);
  }

  addCommand(...commands) {
    commands.forEach(c => {
      this.commands[c.invoker]=c;
      this.invokers.push(c.invoker);
    });
  }

  invoke(invoker, that, ...params) {
    if (this.commands[invoker]) {
      this.commands[invoker].execute.call(that, ...params);
      return true;
    }
    return false;
  }
}

class Command {
  constructor(invoker, execute) {
    this.invoker = invoker;
    this.execute = execute;
  }
}

function discordCommands(client, server) {
  const discordProfile = new Command('discord-profile', function(profileName) {
    const path = "./profiles/" + profileName + '/';
    const profile = JSON.parse(fs.readFileSync(path + 'profile.json'));
    client.user.setAvatar(path + profile.avatar);
    if(server) {server.me.setNickname(profile.nickname);}
    this.log("Profile " + profileName + " loaded!");
  });

  const addDiscordChannel = new Command('add-channel', function(id) {
    this.addConversation(new DiscordConversation(client.channels.get(id), client.user.id));
    this.log("Added channel: " + client.channels.get(id).id);
  });
  return [discordProfile, addDiscordChannel];
}


module.exports = {
  CommandCenter: CommandCenter,
  discordCommands: discordCommands
}
