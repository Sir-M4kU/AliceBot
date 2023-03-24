const { Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute (interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No hay ningun comando ${interaction.commandName}.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (err) {
      console.error(`Error al ejecutar el comando ${interaction.commandName}`)
      console.error(err)
    }
  }
}
