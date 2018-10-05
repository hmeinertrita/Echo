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
  constructor(server, url) {
    super();
    this.server = server;
    var r = this.recieve;
    this.server.post(url, (req, res) => this.recieve(req, res));
  }

  recieve(request, response) {
    var mess = request.body.mess;
    super.recieve(mess);
  }

  log(message) {
    //TODO
  }
}

module.exports = {
  AdminInterface: AdminInterface,
  ConsoleAdminInterface: ConsoleAdminInterface,
  DiscordAdminInterface: DiscordAdminInterface,
  ExpressAdminInterface: ExpressAdminInterface,
}
