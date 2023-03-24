const { Events } = require('distube')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: Events.ADD_SONG,
  execute (queue, song) {
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Se ha añadido a la cola de reproduccion:')
          .setColor('#6495ED')
          .setDescription(song.name)
          .setThumbnail(song.thumbnail)
      ]
    })
  }
}
