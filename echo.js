var events = require('events');
const commands = require('./commands.js');

class Echo extends events.EventEmitter {
  constructor(app) {
    super();
    this.app = app;
  }

  //============================================================================
  //* CONVERSATION HANDLING
  //============================================================================

  //* Add a conversation Echo is in
  addConversation(conversation) {
    if(!this.app.currentConversation) {
      this.app.currentConversation = conversation;
    }
    this.on('send', (message) => {
      conversation.send(message);
    });
    conversation.on('message', (message, user, conversation) => {
      this.listen(message, user, conversation);
    });
  }

  //* Set the current conversation Echo is in
  setCurrentConversation(conversation) {
    this.app.currentConversation = conversation;
  }

  //* Handle a message sent in conversation Echo is in
  listen(message, user, conversation) {
    if (conversation === this.app.currentConversation) {
      this.log(user + ": " + message);
    }
    else {
      this.log('#' + conversation.name + '@' + user + ": " + message);
    }
  }

  //* Send a message to the current conversation
  send(message) {
    if(this.app.currentConversation){
      this.emit('send', message, this.app.currentConversation);
    }
    else {
      this.log("No conversation specificed! Please specify a conversation before sending.");
    }
  }

  //============================================================================
  //* ADMIN INTERFACE
  //============================================================================

  //* Add a admin interface
  addAdmin(adminInterface) {
    this.on('log', message => {
      adminInterface.log(message);
    });
    adminInterface.on('recieve', message => {
      this.recieve(message);
    });
  }

  //* Recieve a message from an admin interface
  recieve(message) {
    const command = commands.parse(message);
    if(command) {
      this.app = command(this.app, message.replace(/^\S* /, ""));
    }
    else {
      this.send(message);
    }
  }

  //* Log a message to all admin interfaces
  log(message) {
    this.emit('log', message);
  }
}

module.exports = {
  Echo: Echo
}
