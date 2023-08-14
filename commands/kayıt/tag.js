const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Tagı Öğrenirsiniz'),
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
    .setColor(0x00ffff)
    .setAuthor({name: "DarkLon Kayıt", iconURL: interaction.user.avatarURL()})
    .addFields(
      {name: "Tagımız:", value: "❃", inline: true},
      {name: "Yardım Almak İsterseniz", value: "/yardım", inline: true}
    )
    .setFooter({text: "DarkLon Kayıt", iconURL: interaction.user.avatarURL()})
    .setThumbnail("https://cdn.discordapp.com/attachments/1136388462845640744/1140417599285514340/ezgif.com-crop_1.gif")
    interaction.reply({ embeds: [embed]})
  }
}