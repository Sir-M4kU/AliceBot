const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Repite la cancion o la playlist')
    .addStringOption(option => option
      .setName('opcion')
      .setDescription('Selecciona el modo...')
      .setRequired(true)
      .addChoices(
        { name: 'cancion', value: 'cancion' },
        { name: 'playlist', value: 'playlist' },
        { name: 'apagar', value: 'off' }
      )
    ),
  async execute (interaction) {
    const option = interaction.options.getString('opcion')
    const queue = interaction.client.distube.getQueue(interaction.guildId)

    await interaction.deferReply()

    if (!queue) interaction.editReply({ content: 'No hay algo reproduciendose ahora mismo.', ephemeral: true })

    let mode

    switch (option) {
      case 'off':
        mode = 0
        break
      case 'cancion':
        mode = 1
        break
      case 'playlist':
        mode = 2
        break
    }

    queue.setRepeatMode(mode)
    mode = mode ? (mode === 2 ? 'Repetir Playlist' : 'Repetir Cancion') : 'Apagado'
    await interaction.editReply(`El modo repeticion esta asignado a: **${mode}**`).then(msg =>
      setTimeout(() => msg.delete(), 5000)
    )
  }
}
