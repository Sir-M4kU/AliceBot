const { Events } = require('distube')
const { ActivityType } = require('discord.js')

module.exports = {
  name: Events.DISCONNECT,
  execute (queue) {
    queue.textChannel.send('Me han sacado del canal').then(msg => setTimeout(() => msg.delete(), 5000))
    queue.client.user.setActivity({ name: 'comandos', type: ActivityType.Listening })
    if (queue) queue.stop()
  }
}
