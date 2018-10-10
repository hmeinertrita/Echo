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

module.exports = {
  Conversation: Conversation
}
