const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js')
const rache = require("rachedb")
const db = new rache({
    "dbName": "db", // DB dosya adımız.
    "dbFolder": "database", // DB klasör adımız.
    "noBlankData": true,
    "readable": true,
    "language": "tr" // "tr" veya "en" yazabilirsiniz
})
const ayarlar = require("../../config.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isim')
    .setDescription('İsim Değiştirir')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Lütfen Hedefi Seçin')
    )
    .addStringOption(
      option => option
        .setName('isim')
        .setDescription('İsim Girin')
        .setMaxLength(12)
    )
    .addStringOption(
      option => option
        .setName('yaş')
        .setDescription('Yaş Girin')
        .setMaxLength(2)
    ),
  run: async (client, interaction) => {
    var member = interaction.options.getUser('hedef')
    var name = interaction.options.getString('isim')
    var age = interaction.options.getString('yaş')
    let staff = ayarlar.kyetkili
    if (!interaction.member.permissions.has(staff) && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
    const kyapan = await client.users.fetch(interaction.user.id)
    if (member.id == interaction.user.id) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Kendine İşlem Uygulayamazsın!**`)] })
    if (age && age < "15") return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Kullanıcının Yaşı Geçerli Yaştan Küçük!**`)] })
    let Name2 = name.toLocaleLowerCase()[0].toUpperCase() + name.toLocaleLowerCase().substring(1);
    db.push(`isimler-${member.id}`, `\`❃ ${Name2} | ${age}\` (İsim Değiştirme <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
    db.push(`kayıtlar-${interaction.user.id}`, `\`❃ ${Name2} | ${age}\` ${member.username} (İsim Değiştirme <t:${Math.floor(Date.now() / 1000)}>)`);
    await interaction.guild.members.cache.get(member.id).setNickname(`❃ ${Name2} | ${age}`, `${name}`);
    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Kullanıcının İsmi \`❃ ${Name2} | ${age}\` Olarak Değiştirildi!**`)] })
  }
}