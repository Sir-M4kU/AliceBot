const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta a la siguiente cancion'),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)

    if (queue === undefined) await interaction.reply({ content: 'No hay nada reproduciendose ahora mismo', ephemeral: true })

    await interaction.deferReply()

    await queue.skip()
    interaction.deleteReply()
  }
}
