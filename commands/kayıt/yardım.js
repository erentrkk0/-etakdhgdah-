const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('yardım')
  .setDescription('Yardım Alırsınız'),
  run: async (client, interaction) => {
  const yardım = new EmbedBuilder()
  .setAuthor({name: "DarkLon Kayıt", iconURL: interaction.user.avatarURL()})
    .setColor(0x00ffff)
    .addFields(
      {name: "/kayıt", value: "Kayıt Yaparsınız", inline: true},
      {name: "/isim", value: "İsime Bakarsınız", inline: true},
      {name: "/isimler", value: "Geçmiş İsimlere Bakarsınız", inline: true},
      {name: "/kayıtlar", value: "Üyenin Kayıtları", inline: true},
      {name: "/kayıtsız", value: "Kullanıcıyı Kayıtsıza Atma", inline: true},
      {name: "/say", value: "Sunucunun Kullanıcı Bilgisi", inline: true},
      {name: "/tag", value: "Sunucunun Tagına Bakarsınız", inline: true}
    )
  .setFooter({text: "DarkLon Kayıt", iconURL: interaction.user.avatarURL()})
  .setThumbnail("https://cdn.discordapp.com/attachments/1136388462845640744/1140417599285514340/ezgif.com-crop_1.gif")
   await interaction.reply({embeds: [yardım]})
  }
}