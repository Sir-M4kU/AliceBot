const { Events } = require('distube')
const { EmbedBuilder, ActivityType } = require('discord.js')

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
            { name: 'Pedida por', value: `${song.user}`, inline: true },
            { name: 'Duracion', value: `${song.formattedDuration}`, inline: true }
          )
      ]
    }).then(msg => setTimeout(() => msg.delete(), (song.isLive) ? 7000 : song.duration * 1000))
    queue.client.user.setActivity({ name: `${song.name}`, type: ActivityType.Streaming, url: `${song.url}` })
  }
}
