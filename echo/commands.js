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

class CompositeCommand extends Command {
  constructor(invoker) {
    var execute = function (...params) {
      console.log('executing composite command with params ' + params);
      const executables = getExecutables(params);
      for (let executable of executables) {
        executable.execute.call(this, executable.params);
      }
    };
    super(invoker, execute);

    this.params = {};
    this.commands = [];
    const getExecutables = (...params) => {
      console.log('building executables with default params ' + params);
      const executables = [];
      for (let command of this.commands) {
        console.log(this.params);
        var p = this.params[command.invoker].length ? this.params[command.invoker] : params;
        console.log('pushing executable '+command.invoker+' with params' + p);
        executables.push({
          execute: command.execute,
          params: p
        });
      }
      return executables
    }
  }
  addCommand(command, ...params) {
    this.commands.push(command);
    this.params[command.invoker] = params;
  }
}

const loadProfile = new Command('load-profile', function(profileName) {
  this.profile = JSON.parse(fs.readFileSync(this.profilePath + profileName + '/profile.json'));
  this.log("Loaded Profile: "+this.profile.nickname);
});

const changeProfile = new CompositeCommand('profile');
changeProfile.addCommand(loadProfile);

module.exports = {
  CommandCenter: CommandCenter,
  Command: Command,
  changeProfileCommand: changeProfile
}
