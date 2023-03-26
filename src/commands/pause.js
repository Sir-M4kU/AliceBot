const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa/reanuda la cancion'),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)

    await interaction.deferReply()

    if (queue === undefined) await interaction.editReply({ content: 'Ahora mismo no hay nada reproduciendose', ephemeral: true })
    if (queue.paused) await queue.resume().then(msg => msg.delete())

    queue.pause()
    interaction.deleteReply()
  }
}
