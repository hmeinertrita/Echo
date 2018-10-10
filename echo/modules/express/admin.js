const admin = require('../../admin.js');

class ExpressAdminInterface extends admin.AdminInterface {
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
  ExpressAdminInterface: ExpressAdminInterface
}
