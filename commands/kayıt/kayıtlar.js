const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const ayarlar = require('../../config.js')
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
    .setName('kayıtlar')
    .setDescription('Kayıtlar')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Kayıtlarına Bakılacak Hedefi Seçin')
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    let member = interaction.options.getUser('hedef')
    let staff = ayarlar.kyetkili
    let erkek = await db.get(`erkek-${member.id}`) || 0;
       let kadın = await db.get(`kadın-${member.id}`) || 0;
    if (!interaction.member.permissions.has(staff) && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })
    let names = db.get(`kayıtlar-${member.id}`);
        if (!names) return interaction.reply({ embeds: [beş_embed.setDescription(`> **${member} Kullanıcısının Kayıt Verisi Bulunmamakta!**`)] }).sil(5);
        if(names && names.length <= 10){
        interaction.reply({ embeds: [new EmbedBuilder().setTitle("Kullanıcının Geçmiş Verileri").setFooter({text:`Kayıt Sayı: Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek+kadın)}`}).setDescription(names.map((data, n) => `${data}`).join("\n"))] })
        }else {
    let pages = 1;
    const beş_buttons = new ActionRowBuilder()
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
      components: [beş_buttons], embeds: [
        new EmbedBuilder().setTitle("Kullanıcının Kayıt Geçmişi").setDescription(`${names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).map((data, n) => `${data}`).join("\n")}`).setFooter({ text: `Sayfa #${pages} / Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek + kadın)}` })]
    })

    const filter = i => i.user.id === interaction.user.id;
    const collector = mesaj.createMessageComponentCollector({ filter: filter, time: 120000 });
    collector.on("collect", async (beş) => {
      if (beş.customId == "beş_skip") {
        if (names.slice((pages + 1) * 10 - 10, (pages + 1) * 10).length <= 0) return beş.reply({ ephemeral: true, content: `> **❌ Daha Fazla Veri Bulunmamakta!**` });
        pages += 1;
        let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
        await beş.update({
          components: [beş_buttons], embeds: [
            new EmbedBuilder().setTitle("Kullanıcının Kayıt Geçmişi").setFooter({ text: `Sayfa #${pages} / Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek + kadın)}` }).setDescription(newData)]
        })
      } else
        if (beş.customId == "beş_back") {
          if (pages == 1) return beş.reply({ ephemeral: true, content: `> **❌ İlk Sayfadasın, Geriye Gidemezsin!**` });
          pages -= 1;
          let newData = names.slice(pages == 1 ? 0 : pages * 10 - 10, pages * 10).join("\n");
          await beş.update({
            components: [beş_buttons], embeds: [
              new EmbedBuilder().setTitle("Kullanıcının Kayıt Geçmişi").setFooter({ text: `Sayfa #${pages} / Erkek; ${erkek} | Kadın; ${kadın} | Toplam ${(erkek + kadın)}` }).setDescription(newData)]
          })
        } else if (beş.customId == "beş_exit") {
          beş.reply({ ephemeral: true, content: `> **🗑️ Panel Başarıyla Silindi!**` })
          mesaj.delete().catch((bes) => { })
        }
    })
        }
  }
}