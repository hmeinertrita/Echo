var events = require('events');
class AdminInterface extends events.EventEmitter {
  constructor() {
    super();
  }

  recieve(message) {
    this.emit('recieve', message);
  }

  log() {}
}

const readline = require('readline');
class ConsoleAdminInterface extends AdminInterface {
  constructor() {
    super();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.rl.on('line', (input) => {
      this.recieve(input);
    });
  }

  log(message) {
    console.log(message);
  }
}

const discord = require('discord.js');
class DiscordAdminInterface extends AdminInterface {
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

class ExpressAdminInterface extends AdminInterface {
  constructor(socket, server, postUrl, getUrl) {
    super();
    this.messages = [];
    this.server = server;
    this.socket = socket;

    //Non-persistent handling
    this.server.post(postUrl, (req, res) => this.recieve(req, res));
    this.server.get(getUrl, (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send({
        latestMessage: this.messages[-1],
        messages: messages
      });
    });

    //Persistent handling
    socket.on('recieve', msg => {
      super.recieve(msg);
    });
  }

  recieve(request, response) {
    var mess = request.body.mess;
    super.recieve(mess);
  }

  log(message) {
    this.messages.push(message);
    this.socket.emit('log', message);
  }
}

module.exports = {
  AdminInterface: AdminInterface,
  ConsoleAdminInterface: ConsoleAdminInterface,
  DiscordAdminInterface: DiscordAdminInterface,
  ExpressAdminInterface: ExpressAdminInterface,
}
