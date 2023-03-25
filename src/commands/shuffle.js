const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Establece la lista en aleatorio'),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)

    if (queue === undefined) await interaction.reply({ content: 'No hay nada reproduciendose ahora mismo.', ephemeral: true })

    await interaction.deferReply()

    queue.shuffle()
    interaction.followUp('La lista se ha mezclado').then(msg => setTimeout(() => msg.delete(), 5000))
  }
}
