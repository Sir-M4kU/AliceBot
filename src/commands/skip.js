const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta a la siguiente cancion'),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)
    await interaction.deferReply()

    await queue.skip()
    interaction.deleteReply()
  }
}
