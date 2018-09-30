var events = require('events');
class Conversation extends events.EventEmitter {
  constructor(name, echoId) {
    super();
    this.name = name;
    this.echoId = echoId;
  }

  send(message) {
  }

  recieve(message, user) {
    this.emit('message', message, user, this);
  }
}

const discord = require('discord.js');
class DiscordConversation extends Conversation {
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
  Conversation: Conversation,
  DiscordConversation: DiscordConversation,
}
