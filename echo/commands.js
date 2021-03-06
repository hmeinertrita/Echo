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
      const executables = getExecutables(params);
      for (let executable of executables) {
        executable.execute.call(this, executable.params);
      }
    };
    super(invoker, execute);

    this.params = {};
    this.commands = [];
    const getExecutables = (...params) => {
      const executables = [];
      for (let command of this.commands) {
        var p = this.params[command.invoker].length ? this.params[command.invoker] : params;
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
  if (!this.profiles[profileName]) {
    this.profiles[profileName] = JSON.parse(fs.readFileSync(this.profilePath + profileName + '/profile.json'));
  }
  this.profile = this.profiles[profileName];
  this.log("Loaded Profile: "+this.profile.nickname);
});

const changeProfile = new CompositeCommand('profile');
changeProfile.addCommand(loadProfile);

module.exports = {
  CommandCenter: CommandCenter,
  Command: Command,
  CompositeCommand: CompositeCommand,
  changeProfileCommand: changeProfile
}
