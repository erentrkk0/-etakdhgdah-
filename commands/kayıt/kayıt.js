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
    .setName('kayıt')
    .setDescription('Kayıt Komutu')
    .addUserOption(option =>
      option.setName('hedef')
        .setDescription('Kayıt Edilecek Hedef')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('isim')
        .setDescription('Hedefin İsmi')
        .setRequired(true)
        .setMaxLength(12)
    )
    .addIntegerOption(option =>
      option.setName('yaş')
        .setDescription('Hedefin Yaşı')
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    let yetkili = ayarlar.kyetkili
    let log = ayarlar.logkanal
    let erkek = ayarlar.man
    let erkek1 = ayarlar.man1
    let erkek2 = ayarlar.man2
    let kadın = ayarlar.woman
    let kadın1 = ayarlar.woman1
    let kadın2 = ayarlar.woman2
    let tagData = db.get(`tag-${interaction.guild.id}`)
    let chat = ayarlar.chat
    let aile = ayarlar.aile
    if (!interaction.member.permissions.has(yetkili) && interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] })

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Erkek')
      .setEmoji("🚹")
      .setStyle(ButtonStyle.Secondary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Kadın')
      .setEmoji("🚺")
      .setStyle(ButtonStyle.Secondary);
    const sil = new ButtonBuilder()
      .setCustomId('iptal')
      .setLabel('İptal')
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(confirm, cancel, sil);

    let member = interaction.options.getUser('hedef')
    let user = interaction.guild.members.cache.get(member.id)
    let name = interaction.options.getString('isim')
    let age = interaction.options.getInteger('yaş')

    if (user.roles.cache.get(erkek2) || user.roles.cache.get(kadın1)) return interaction.reply({ embeds: [new EmbedBuilder.setDescription(`> **Kayıtlı Bir Kullanıcıyı Tekrar Kayıt Edemezsin!**`)] })
    if (user.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ embeds: [new EmbedBuilder.setDescription(`> **İşlem Geçersiz Senden Üst/Aynı Pozisyonda Birisini Kayıt Edemezsin!**`)] })
    let Name2 = name.toLocaleLowerCase()[0].toUpperCase() + name.toLocaleLowerCase().substring(1);
    const kyapan = await client.users.fetch(interaction.user.id)
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ffff)
          .setAuthor({ name: "Kayıt", iconURL: interaction.user.avatarURL() })
          .setDescription(`> **Kullanıcının ismi** \`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` **Olarak Değiştirilecek!**\n> **Butonlardan Kullanıcının Cinsiyetini Seçiniz.**\n> Kayıt Edilecek Üye ${member}`)
      ],
      components: [row]
    })
    const filter = i => i.user.id === interaction.user.id;
    const confirmation = await interaction.channel.awaitMessageComponent({ filter: filter, time: 60000 });

    if (confirmation.customId === 'confirm') {
      db.add(`erkek-${interaction.user.id}`, 1)
      db.push(`isimler-${member.id}`, `\`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` (${erkek.map((bes) => `<@&${bes}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.username})`);
      db.push(`kayıtlar-${interaction.user.id}`, `\`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` (${erkek.map((bes) => `<@&${bes}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}>)`);
      if (tagData && tagData.some(tag => member.user.displayName.includes(tag))) {

        await user.roles.set([erkek1, erkek2, aile])
        await user.setNickname(`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}`).catch(e => { console.log(e) })

      } else {

        await user.setNickname(`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}`).catch(e => { console.log(e) })

        await user.roles.set([erkek1, erkek2])
        await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`> **<@${member.id}> Kullanıcının ismi** \`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` **Olarak Değiştirildi**\n> **Ve ${ayarlar.manemoji} ${erkek.map((bes) => `<@&${bes}>`).join(",")} Rolü Verilerek Kayıt Edildi.**`)], components: [] })
        if (interaction.guild.channels.cache.get(chat)) interaction.guild.channels.cache.get(chat).send({ content: `> **${ayarlar.manemoji} ${member} Aramıza Hoşgeldin!**` })

      }
    } else if (confirmation.customId === 'cancel') {
      db.add(`kadın-${interaction.user.id}`, 1)
      db.push(`isimler-${member.id}`, `\`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` (${kadın.map((bes) => `<@&${bes}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.username})`);
      db.push(`kayıtlar-${interaction.user.id}`, `\`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` (${kadın.map((bes) => `<@&${bes}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}>)`);
      if (tagData && tagData.some(tag => member.user.displayName.includes(tag))) {

        await user.roles.set([kadın1, kadın2, aile])
        await user.setNickname(`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}`).catch(e => { console.log(e) })

      } else {

        await user.setNickname(`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}`).catch(e => { console.log(e) })

        await user.roles.set([kadın1, kadın2])
        await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`> **<@${member.id}> Kullanıcının ismi** \`${ayarlar.tag} ${Name2}${age ? ` ${ayarlar.symbol} ${age}` : ""}\` **Olarak Değiştirildi**\n> **Ve ${ayarlar.manemoji} ${kadın.map((bes) => `<@&${bes}>`).join(",")} Rolü Verilerek Kayıt Edildi.**`)], components: [] })
        if (interaction.guild.channels.cache.get(chat)) interaction.guild.channels.cache.get(chat).send({ content: `> **${ayarlar.manemoji} ${member} Aramıza Hoşgeldin!**` })

      }
    } else if (confirmation.customId === 'iptal') {
      await interaction.guild.members.cache.get(member.id).setNickname("❃ İsim | Yaş")
      await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`> **İşlem Başarıyla İptal Edildi!**`)], components: [] })
    }
  }
}