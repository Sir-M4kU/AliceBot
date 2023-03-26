const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Muestra el ping de la API'),
  async execute (interaction) {
    await interaction.reply(`¡Pong!\nLa latencia es de: **${interaction.client.ws.ping} ms**`).then(msg =>
      setTimeout(() => msg.delete(), 5000)
    )
  }
}
