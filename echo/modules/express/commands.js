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

module.exports = (path) => {
  const copyAvatar = new commands.Command("copy-avatar", function() {
    const src = this.profilePath + this.profile.id + '/' + this.profile.avatar;
    const dest = __dirname + path + '/avatar.png';
    this.log('copying avatar to webserver...');
    fs.copyFile(src, dest, err => {
      if (err) throw err;
      this.log('copied!');
    });
  });

  const socketProfile = new SocketCommand('socket-profile', socket => {
    return function() {
      socket.emit('profile', this.profile);
    };
  });

  return [copyAvatar, socketProfile];
};
