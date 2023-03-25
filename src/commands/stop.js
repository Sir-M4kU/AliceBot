const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la musica'),
  async execute (interaction) {
    const player = interaction.client.distube
    const queue = player.getQueue(interaction.guildId)

    if (queue === undefined) return await interaction.reply({ content: 'No hay nada reproduciendose', ephemeral: true })

    await interaction.deferReply()

    player.stop(queue)
    interaction.followUp('Se ha detenido la lista').then(msg => setTimeout(() => msg.delete(), 5000))
  }
}
