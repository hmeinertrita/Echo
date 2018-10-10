const fs = require('fs');

class CommandCenter {
  constructor(...commands) {
    this.commands={};
    this.invokers=[];
    this.addCommand(commands);
  }

  addCommand(...commands) {
    commands.forEach(c => {
      this.commands[c.invoker]=c;
      this.invokers.push(c.invoker);
    });
  }

  invoke(invoker, that, ...params) {
    if (this.commands[invoker]) {
      this.commands[invoker].execute.call(that, ...params);
      return true;
    }
    return false;
  }
}

class Command {
  constructor(invoker, execute) {
    this.invoker = invoker;
    this.execute = execute;
  }
}


module.exports = {
  CommandCenter: CommandCenter,
  Command: Command
}
