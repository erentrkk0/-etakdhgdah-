const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const ayarlar = require('../../config.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kayıtsız')
    .setDescription('Hedef Kayıtsız Rolüne Atılır')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Hedef Üyeyi Seçin')
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    let member = interaction.options.getUser('hedef')
    let user = interaction.guild.members.cache.get(member.id)
    let staff = ayarlar.kyetkili
    if (!interaction.member.permissions.has(staff) && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Onayla')
      .setStyle(ButtonStyle.Success);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('İptal')
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder()
      .addComponents(cancel, confirm);
    const embed = new EmbedBuilder()
      .setColor(0x00ffff)
      .setAuthor({ name: "Kayıtsıza Atma", iconURL: interaction.user.avatarURL() })
      .setDescription(`
      ${member} adlı kişiyi \`Kayıtsız Rolüne\` Atmak İstediğine Emin misin?
      `)
    await interaction.reply({ embeds: [embed], components: [row] })
    const onay = new EmbedBuilder()
      .setColor(0x00ff00)
      .setAuthor({ name: "Kayıtsıza Atma", iconURL: interaction.user.avatarURL() })
      .setDescription(`
      ${member} adlı Kişi \`Kayıtsız Rolüne\` Atıldı!
      `)
    const iptal = new EmbedBuilder()
      .setColor(0xff0000)
      .setAuthor({ name: "Sıfırlama İşlemi", iconURL: interaction.user.avatarURL() })
      .setDescription(`
      ${member} adlı kişi \`Kayıtsız Rolüne\` Atılmadı!
      `)
    const collectorFilter = i => i.user.id === interaction.user.id;
    const confirmation = await interaction.channel.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

    if (confirmation.customId === 'confirm') {
      await user.roles.cache.has(interaction.guild.roles.premiumSubscriberRole ? interaction.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([interaction.guild.roles.premiumSubscriberRole.id, ayarlar.kayıtsız]) : user.roles.set([ayarlar.kayıtsız])
      await interaction.editReply({ embeds: [onay], components: [] })
    } else if (confirmation.customId === 'cancel') {
      await interaction.editReply({ embeds: [iptal], components: [] });
    }
  }
}