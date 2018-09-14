var events = require('events');
const commands = require('./commands.js');

class Echo extends events.EventEmitter {
  constructor(app) {
    super();
    this.app = app;
  }

  addInterface(adminInterface) {
    this.on('log', adminInterface.log);
    adminInterface.on('recieve', message => {
      this.recieve(message);
    });
  }
  recieve(message) {
    const command = commands.parse(message);
    if(command) {
      this.app = command(this.app, message.replace(/^\S* /, ""));
    }
    else {
      this.send(message);
    }
  }
  log(message) {
    this.emit('log', message);
  }
  send(message) {
    if(this.app.channel){
      this.app.channel.send(message);
      this.log(message);
    }
    else {
      this.log("No channel specificed! Please specify a channel before sending.");
    }
  }
}

module.exports = {
  Echo: Echo
}
