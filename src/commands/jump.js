const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jump')
    .setDescription('Salta a una cancion.')
    .addNumberOption(option => option
      .setName('num')
      .setDescription('Escribe el numero de la cancion')
      .setRequired(true)
    ),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)
    const num = interaction.options.getNumber('num')

    if (queue === undefined) await interaction.reply({ content: 'No hay nada reproduciendose', ephemeral: true })

    await interaction.deferReply()

    try {
      queue.jump(queue, num)
      interaction.deleteReply()
    } catch (err) {
      console.error(err)
      await interaction.followUp('Ha ocurrido un error').then(msg =>
        setTimeout(() => msg.delete(), 7000)
      )
    }
  }
}
