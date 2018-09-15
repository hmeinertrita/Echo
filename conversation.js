var events = require('events');
class Conversation extends events.EventEmitter {
  constructor(channel) {
    super();
    this.channel = channel;
    this.collector = new discord.MessageCollector(channel, message => {
      return id != message.author.id;
    });
    this.collector.on('collect', message => {
      this.emit('message', message);
    });
  }

  send(message, conversationId) {
    if (conversationId == this.channel.id) {
      this.channel.send(message);
    }
  }
}

module.exports = {
  Conversation: Conversation,
}
