const commands = require('../../commands.js');
const discordConversations = require('../../commands.js');

module.exports = (client, server) => {
  const discordProfile = new commands.Command('discord-profile', function() {
    client.user.setAvatar(this.profilePath + this.profile.id + '/' + this.profile.avatar);
    if(server) {
      server.me.setNickname(this.profile.nickname);
      this.log('Set discord server nickname to: '+this.profile.nickname);
    }
    this.log("Discord bot now using profile: " + this.profile.id);
  });

  const addDiscordChannel = new commands.Command('add-channel', function(id) {
    this.addConversation(new discordConversations.DiscordConversation(client.channels.get(id), client.user.id));
    this.log("Added discord channel: " + client.channels.get(id).id);
  });

  return [discordProfile, addDiscordChannel];
};
