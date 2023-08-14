const { EmbedBuilder, InteractionType } = require("discord.js");
const { readdirSync } = require("fs");
const { owner } = require("../config.js");

module.exports = {
  name: 'interactionCreate',
  execute: async (interaction) => {
    let client = interaction.client;
    if (!interaction.type == InteractionType.ApplicationCommand) return;
    if (interaction.user.bot) return;
    readdirSync('./commands/').forEach(async dir => {
      const commandFiles = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`../commands/${dir}/${file}`);
        if (interaction.commandName === command.data.name) {
          command.run(client, interaction)
        }
      }
    })
  }
}