const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const rache = require("rachedb")
const db = new rache({
    "dbName": "db", // DB dosya adımız.
    "dbFolder": "database", // DB klasör adımız.
    "noBlankData": true,
    "readable": true,
    "language": "tr" // "tr" veya "en" yazabilirsiniz
})

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Sunucu Üye Bilgileri'),
  run: async (client, interaction) => {
    let tagData = db.get(`tag-${interaction.guild.id}`)
    if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator))return interaction.reply({ embeds: [new EmbedBuidler().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
    let aktif = interaction.guild.members.cache.filter(member => member.presence && (member.presence.status != "offline")).size
    let uye = interaction.guild.memberCount
    let bot = interaction.guild.channels.cache.filter(channel => channel.type == ChannelType.GuildVoice).map(channel => channel.members.filter(member => member.user.bot).size).reduce((a, b) => a + b);
    let sesli = interaction.guild.members.cache.filter(x => !x.user.bot && x.voice.channel).size
    let boost = interaction.guild.premiumSubscriptionCount;
    
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Sunucumuzda Toplam ${uye} Üye Bulunuyor!**\n> **Toplam ${aktif} Aktif Kişi Bulunuyor!**\n> **Toplam ${sesli} \`(+${bot} Bot)\` Kişi Seste Bulunuyor!**\n> **${boost} Adet Boost Bulunmakta!**\n> **Toplam ${tagData ?? "0"} Taglı Üyemiz Bulunmakta!**`).setThumbnail(interaction.guild.iconURL({dynamic:true})).setTitle(`İstatistik`)] });
  }
}