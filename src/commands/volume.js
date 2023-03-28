const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Ajusta el volumen')
    .addNumberOption(option => option
      .setName('cantidad')
      .setDescription('Desde 0 hasta 100')
      .setRequired(true)
    ),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)
    const volumen = interaction.options.getNumber('cantidad')

    await interaction.deferReply()

    if (queue === undefined) interaction.editReply({ content: 'No hay algo reproduciendose ahora mismo.', ephemeral: true })

    queue.setVolume(volumen)
    await interaction.editReply(`Se ajusto el volumen al **${volumen}%**.`).then(msg => setTimeout(() => msg.delete(), 5000))
  }
}
