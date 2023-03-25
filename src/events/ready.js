const { Events, ActivityType } = require('discord.js')

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute (client) {
    console.log(`Cargado como ${client.user.tag}`)
    client.user.setActivity({ name: 'comandos', type: ActivityType.Listening })
  }
}
