const { Events } = require('distube')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: Events.PLAY_SONG,
  execute (queue, song) {
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Reproduciendo ahora:')
          .setDescription(song.name)
          .setColor('#40E0D0')
          .setURL(song.url)
          .setThumbnail(song.thumbnail)
          .setFields(
            { name: 'Pedida por', value: `${song.user}` },
            { name: 'Duracion', value: `${song.formattedDuration}` }
          )
      ]
    })
  }
}
