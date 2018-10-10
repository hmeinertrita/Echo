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

module.exports = {
  AdminInterface: AdminInterface,
  ConsoleAdminInterface: ConsoleAdminInterface
}
