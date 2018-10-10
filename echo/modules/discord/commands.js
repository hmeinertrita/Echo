const commands = require('../../commands.js');
const discordConversations = require('../../commands.js');

module.exports = (client, server) => {
  const discordProfile = new commands.Command('discord-profile', function(profileName) {
    const path = "./profiles/" + profileName + '/';
    const profile = JSON.parse(fs.readFileSync(path + 'profile.json'));
    client.user.setAvatar(path + profile.avatar);
    if(server) {server.me.setNickname(profile.nickname);}
    this.log("Profile " + profileName + " loaded!");
  });

  const addDiscordChannel = new commands.Command('add-channel', function(id) {
    this.addConversation(new discordConversations.DiscordConversation(client.channels.get(id), client.user.id));
    this.log("Added channel: " + client.channels.get(id).id);
  });

  return [discordProfile, addDiscordChannel];
};
