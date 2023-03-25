const { Events } = require('distube')
const { ActivityType } = require('discord.js')

module.exports = {
  name: Events.FINISH_SONG,
  execute (queue) {
    queue.client.user.setActivity({ name: 'comandos', type: ActivityType.Listening })
  }
}
