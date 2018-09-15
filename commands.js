const fs = require('fs');

load = function(app, profileName) {
  const path = "./profiles/" + profileName + '/';
  const profile = JSON.parse(fs.readFileSync(path + 'profile.json'));
  app.client.user.setAvatar(path + profile.avatar);
  app.server.me.setNickname(profile.nickname);
  console.log("Profile " + profileName + " loaded!");
  return app;
}

conversation = function(app, id) {
  app.channel=app.client.channels.get(id);
  this.log("channel set to: " + app.channel.id);
  return app;
}
server = function(app, id) {
  app.server = app.client.guilds.get(id);
  this.log("server set to: " + app.server.id);
  return app;
}

function parse(message) {
  const keywords = ["server", "load", "conversation"];
  var command;
  keywords.forEach(val => {
    if (message.startsWith(val+" ")) {
      command = global[val];
    }
  });
  return command;
}

module.exports = {
  parse: parse
}
