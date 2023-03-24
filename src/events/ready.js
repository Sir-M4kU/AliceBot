const { Events } = require('discord.js')

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute (client) {
    console.log(`Cargado como ${client.user.tag}`)
  }
}
