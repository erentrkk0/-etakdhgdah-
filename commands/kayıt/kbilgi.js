const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Hedef Üyenin Bilgileri')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Hedef Üyenin Bilgileri')
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const user = interaction.options.getUser('hedef');
    const member = await interaction.guild.members.fetch(user.id);

  const avatar = new ButtonBuilder()
    .setLabel('Avatar')
    .setStyle(ButtonStyle.Link)
    .setURL(`${member.displayAvatarURL({ dynamic: true })}`)

  const butonlar = new ActionRowBuilder().addComponents(avatar)
    
const embed = new EmbedBuilder()
      .setDescription(
        `
      • Kullanıcı: (<@${member.id}> - \`${member.id}\`)
      • Sunucuya Katılım Sırası: ${(interaction.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}/${(interaction.guild.memberCount).toLocaleString()}
      • Hesap Kuruluş: <t:${parseInt(user.createdTimestamp / 1000)}> (<t:${parseInt(user.createdTimestamp / 1000)}:R>)
      • Sunucuya Katılım: <t:${parseInt(member.joinedAt / 1000)}:R>
      • Roller: ${member.roles.cache.map(r => r).join(' ') ? member.roles.cache.map(r => r).join(', ') : "Hiç Rolü Yok"}
      `)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${user.username} Bilgileri`)
      .setImage(interaction.guild.bannerURL())
    
    await interaction.reply({
      embeds: [embed],
      components: [butonlar]
    });
  }
}