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
  constructor(server, pushLog) {
    super();
    this.server = server;
    this.sockets = [];
    this.pushLog = pushLog;
  }

  recieve(request, response) {
    var mess = request.body.mess;
    super.recieve(mess);
  }

  addSocket(socket) {
    this.sockets.push(socket);
    socket.on('recieve', msg => {
      super.recieve(msg);
    });
  }

  log(message) {
    this.pushLog(message);
    this.sockets.forEach(s => {
      s.emit('log', message);
    });
  }
}

module.exports = {
  AdminInterface: AdminInterface,
  ConsoleAdminInterface: ConsoleAdminInterface,
  DiscordAdminInterface: DiscordAdminInterface,
  ExpressAdminInterface: ExpressAdminInterface,
}
