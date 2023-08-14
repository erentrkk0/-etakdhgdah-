const { Client, Collection, GatewayIntentBits, Partials, Events, EmbedBuilder, ShardingManager, ActivityType } = require("discord.js");
const fs = require('fs')
const client = new Client({
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [{
      name: "Darklon Kayıt",
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/erenturkk0"
    }],
    status: 'dnd'
  }
});

client.on('ready', ready => {
  client.user.setActivity("DarkLon Kayıt")
  client.user.setStatus(ActivityType.treaming)
})
const ayarlar = require("./config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const rache = require("rachedb")
const db = new rache({
    "dbName": "db", // DB dosya adımız.
    "dbFolder": "database", // DB klasör adımız.
    "noBlankData": true,
    "readable": true,
    "language": "tr" // "tr" veya "en" yazabilirsiniz
})

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(ayarlar.token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

//command-handler
const commands = [];
fs.readdirSync('./commands/').forEach(async dir => {
  const commandFiles = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    console.log(`[ Carnoxis - Komut ] ${command.data.name} Yüklendi!`)
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);

  }
})

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
  } catch (error) {
    console.error(error);
  }
  console.log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`📚 [Carnoxis _ EVENTS] ${event.name} Yüklendi!`);
  }
}
//

client.login(ayarlar.token)

client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    let tag = "❃"; //tagınız
    let sunucu = "544253404910977025"; //sunucu ID
    let kanal = "1131980885932126329" //log kanal id
    let rol = "1131952163166355496"; // rol ID
    let tagData = db.get(`tag-${interaction.guild.id}`)
    if (tagData && tagData.some(tag => oldUser.tag.includes(tag)) && !tagData.some(tag => newUser.tag.includes(tag))) {
        if(kanal)kanal.send({ embeds: [new EmbedBuilder().setDescription(`> **${newUser} İsminden \`Tagımızı\` Çıkarttı Ailemizden Ayrıldı!**\n\n> **Önceki Kullanıcı Adı: \`${oldUser.tag}\`**\n> **Sonraki Kullanıcı Adı: \`${newUser.tag}\`**`).setColor(`#ff0000`)] })
       if(Member.displayName.includes(tag) && Member.manageable) await Member.setNickname(Member.displayName.replace(tag,"•")) 
        let role = Guild.roles.cache.get(ayarlar.aile);
        let roles = Member.roles.cache.clone().filter(e => e.managed || e.position < role.position);
        await Member.roles.set(roles).catch();
    }
    if (tagData && !tagData.some(tag => oldUser.tag.includes(tag)) && tagData.some(tag => newUser.tag.includes(tag))) {
        Member.roles.add(ayarlar.aile)
        if(Member.displayName.includes("•") && Member.manageable) await Member.setNickname(Member.displayName.replace("•",tag)) 
        if(log)log.send({ embeds: [new EmbedBuilder().setDescription(`> **${newUser} İsmine \`Tagımızı\` Alarak Ailemize Katıldı!**\n\n> **Önceki Kullanıcı Adı: \`${oldUser.displayName}\`**\n> **Sonraki Kullanıcı Adı: \`${newUser.displayName}\`**`).setColor(`#00ff00`)] })
        if(chat)chat.send(`> **🎉 Tebrikler, ${newUser} Tag Alarak Ailemize Katıldı! Hoşgeldin.**`)
    }

  }
})
