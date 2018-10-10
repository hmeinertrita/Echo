const admin = require('../../admin.js');
const discord = require('discord.js');

class DiscordAdminInterface extends admin.AdminInterface {
  constructor(channel,id) {
    super();
    this.channel = channel;
    this.collector = new discord.MessageCollector(channel, message => {
      return id === message.author.id;
    });
    this.collector.on('collect', message => {
      this.recieve(message.cleanContent);
    });
  }
  log(message) {
    this.channel.send(message);
  }
}

module.exports = {
  DiscordAdminInterface: DiscordAdminInterface
}
