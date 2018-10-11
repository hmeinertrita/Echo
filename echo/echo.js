var events = require('events');
const fs = require('fs');
const commands = require('./commands.js');
const admin = require('./admin.js');


class Echo extends events.EventEmitter {
  constructor(initializeConsole) {
    super();
    this.profilePath = './profiles/';
    this.commandCenter = new commands.CommandCenter();
    this.stream = fs.createWriteStream(__dirname + "/logs/log.txt", {flags:'a'});
    if (initializeConsole) {
      this.addAdmin(new admin.ConsoleAdminInterface());
    }
    this.commandCenter.addCommand(commands.changeProfileCommand);
  }

  loadModule(module) {
    module(this);
  }

  //============================================================================
  //* CONVERSATION HANDLING
  //============================================================================

  //* Add a conversation Echo is in
  addConversation(conversation) {
    if(!this.currentConversation) {
      this.currentConversation = conversation;
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
    this.currentConversation = conversation;
  }

  //* Handle a message sent in conversation Echo is in
  listen(message, user, conversation) {
    if (conversation === this.currentConversation) {
      this.log(user + ": " + message);
    }
    else {
      this.log('#' + conversation.name + '@' + user + ": " + message);
    }
  }

  //* Send a message to the current conversation
  send(message) {
    if(this.currentConversation){
      this.emit('send', message, this.currentConversation);
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
    const params = message.split(" ");
    const invoked = this.commandCenter.invoke(params[0], this, ...params.splice(1));
    if(!invoked) {
      this.send(message);
    }
  }

  //* Log a message to all admin interfaces
  log(message) {
    this.stream.write((new Date()).toUTCString() + " ------ " + message + "\n");
    this.emit('log', message);
  }

  //* Load commands
  loadCommand(...commands) {
    this.commandCenter.addCommand(...commands);
  }
}

module.exports = Echo;
