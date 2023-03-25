const { Events } = require('distube')
const { EmbedBuilder, ActivityType } = require('discord.js')

module.exports = {
  name: Events.FINISH,
  execute (queue) {
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Se ha acabado la playlist')
          .setDescription('Agrega mas canciones o desconecta el bot.')
          .setColor('#FFBF00')
      ]
    })
    queue.client.user.setActivity({ name: 'comandos', type: ActivityType.Listening })
  }
}
