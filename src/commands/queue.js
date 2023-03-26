const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la lista de reproduccion.'),
  async execute (interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId)

    if (queue === undefined) await interaction.reply({ content: 'No hay nada en la lista de reproduccion', ephemeral: true })

    await interaction.deferReply()

    await interaction.editReply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Lista de Reproduccion:')
            .setDescription(`${queue.songs.map((song, id) =>
              `**${id === 0 ? '▶️' : `${id}.`}** ${song.name} - ${song.formattedDuration}`
            ).slice(0, 10).join('\n')}`)
            .setThumbnail(queue.songs[0].thumbnail)
            .setFields(
              { name: ' ', value: ' ' },
              { name: '🔈', value: `${queue.volume}%`, inline: true },
              { name: '🔁', value: `${queue.repeatMode ? (queue.repeatMode === 2 ? 'Playlist' : 'Cancion') : 'Apagado'}`, inline: true },
              { name: '⌚', value: `${(queue.songs[0].isLive) ? 'Live' : queue.formattedDuration}`, inline: true }
            )
            .setColor('#FFBF00')
        ]
      })
  }
}
