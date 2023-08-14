const { Collection, ActivityType } = require("discord.js")
const ayarlar = require('../config.js')
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'ready',
  execute: async (client) => {

    client.user.setPresence({ activities: [{ name: 'DarkLon Kayıt', type: ActivityType.Streaming, url: "https://twitch.tv/erenturkk0" }], status: 'idle' });
    joinVoiceChannel({
channelId: ayarlar.botsesli,
guildId: ayarlar.sunucu,
adapterCreator: client.guilds.cache.get(ayarlar.sunucu).voiceAdapterCreator,
selfDeaf: true
});
  }
};

