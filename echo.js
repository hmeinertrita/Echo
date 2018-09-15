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
      this.app.currentConversation = conversation.id;
    }

    this.on('send', conversation.send);
    conversation.on('message', message => {
      listen(message);
    });
  }

  //* Set the current conversation Echo is in
  setCurrentConversation(id) {
    this.app.currentConversation = id;
  }

  //* Handle a message sent in conversation Echo is in
  listen(message) {
    const mess = message.cleanContent.replace("@" + client.user.username + " ", "");
    if (message.channel.id == this.app.currentConversation) {
      this.log(message.member.nickname + ": " + mess);
    }
    else {
      this.log('#' + message.channel.name + '@' + message.member.nickname + ": " + mess);
    }
  }

  //* Send a message to the current conversation
  send(message) {
    if(this.app.currentConversation){
      this.emit('send', message, this.app.currentConversation);
      this.log(message);
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
    this.on('log', adminInterface.log);
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
