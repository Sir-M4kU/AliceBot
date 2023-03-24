const { EmbedBuilder } = require('discord.js')
const { Events } = require('distube')

module.exports = {
  name: Events.ADD_LIST,
  execute (queue, playlist) {
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Se ha cargado la playlist:')
          .setDescription(`Se han cargado ${playlist.songs.length} canciones.`)
          .addFields(
            { name: 'Duracion total:', value: `${playlist.formattedDuration}` }
          )
      ]
    }).then(msg => setTimeout(() => msg.delete(), 5000))
  }
}
