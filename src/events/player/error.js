const { Events } = require('distube')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: Events.ERROR,
  execute (queue, error) {
    console.error(error)
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('¡Ha ocurrido un error!')
          .setDescription('Revisa la consola para saber mas detalles del error')
          .setColor('#DE3163')
      ]
    })
  }
}
