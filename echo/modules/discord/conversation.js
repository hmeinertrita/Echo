const discord = require('discord.js');
const conversation = require('../../conversation.js');

class DiscordConversation extends conversation.Conversation {
  constructor(channel, botId) {
    super(channel.name, botId);
    this.channel = channel;
    this.collector = new discord.MessageCollector(channel, message => {
      return botId != message.author.id;
    });
    this.collector.on('collect', message => {
      this.recieve(message);
    });
  }

  send(message) {
    this.channel.send(message);
  }

  recieve(message) {
    const mess = message.cleanContent;
    super.recieve(mess, message.member.nickname ? message.member.nickname:message.author.username);
  }
}

module.exports = {
  DiscordConversation: DiscordConversation
}
