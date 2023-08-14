const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const rache = require("rachedb")
const db = new rache({
    "dbName": "db", // DB dosya adımız.
    "dbFolder": "database", // DB klasör adımız.
    "noBlankData": true,
    "readable": true,
    "language": "tr" // "tr" veya "en" yazabilirsiniz
})
const ayarlar = require('../../config.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isimler')
    .setDescription('İsimlere Bakarsınız')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Lütfen Hedefi Seçin')
    ),
  run: async (client, interaction) => {
    var member = interaction.options.getUser('hedef')
    var name = interaction.options.getString('isim')
    var age = interaction.options.getString('yaş')
    let staff = ayarlar.kyetkili
    if (!interaction.member.permissions.has(staff) && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
    let names = await db.get(`isimler-${member.id}`);
    if (!names) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **${member} Kullanıcısının İsim Verisi Bulunmamakta!**`)] })
    if (names && names.length <= 10) {
      interaction.reply({ embeds: [new EmbedBuilder().setTitle("Kullanıcının Geçmiş Verileri").setDescription(names.map((data, n) => `${data}`).join("\n"))] })
    } else {
      let pages = 1;
      const butonlar = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("beş_back")
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("beş_exit")
            .setLabel("🗑️")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("beş_skip")
            .setLabel("➡️")
            .setStyle(ButtonStyle.Secondary)
        );
      let mesaj = await interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Kullanıcının Geçmiş Verileri")
          .setDescription(`${names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).map((data, n) => `${data}`).join("\n")}`).setFooter({ text: `Sayfa #${pages}` })], components: [butonlar]
      })

      const filter = i => i.user.id === interaction.member.id;
      const collector = mesaj.createMessageComponentCollector({ filter: filter, time: 120000 });
      collector.on("collect", async (beş) => {
        if (beş.customId == "beş_skip") {
          if (names.slice((pages + 1) * 10 - 10, (pages + 1) * 10).length <= 0) return beş.reply({ ephemeral: true, content: `> **❌ Daha Fazla Veri Bulunmamakta!**` });
          pages += 1;
          let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
          await beş.update({
            components: [butonlar], embeds: [
              new EmbedBuilder().setTitle("Kullanıcının Geçmiş Verileri").setDescription(newData).setFooter({ text: `Sayfa #${pages}` })]
          })
        } else
          if (beş.customId == "beş_back") {
            if (pages == 1) return beş.reply({ ephemeral: true, content: `> **❌ İlk Sayfadasın, Geriye Gidemezsin!**` });
            pages -= 1;
            let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
            await beş.update({
              components: [butonlar], embeds: [
                new EmbedBuilder().setTitle("Kullanıcının Geçmiş Verileri").setDescription(newData).setFooter({ text: `Sayfa #${pages}` })]
            })
          } else if (beş.customId == "beş_exit") {
            beş.reply({ ephemeral: true, content: `> **🗑️ Panel Başarıyla Silindi!**` })
            mesaj.delete().catch((bes) => { })
          }
      })
    }
  }
}