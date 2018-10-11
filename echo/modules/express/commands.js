const commands = require('../../commands.js');
const fs = require('fs');

class SocketCommand extends commands.Command {
  constructor(invoker, creator) {
    var execute = function(...params) {
      const executables = getExecutables(creator);
      for (let executable of executables) {
        executable.execute.call(this, params);
      }
    };
    super(invoker, execute);
    this.sockets = [];
    this.creator = creator;
    const getExecutables = () => {
      const executables = [];
      for (let socket of this.sockets) {
        executables.push({
          execute: this.creator(socket)
        });
      }
      return executables
    }
  }
  addSocket(socket) {
    this.sockets.push(socket);
  }
}

const expressProfile = new SocketCommand('express-profile', socket => {
  return function() {
    socket.emit('profile', this.profile);
  };
});

module.exports = [expressProfile];
