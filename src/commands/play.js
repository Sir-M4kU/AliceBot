const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce musica')
    .addStringOption(option => option
      .setName('cancion')
      .setDescription('Puede ser un link o el nombre de la cancion.')
      .setRequired(true)
    ),
  async execute (interaction) {
    const player = interaction.client.distube
    const voiceChannel = interaction.member.voice.channel
    const song = interaction.options.getString('cancion')

    if (!voiceChannel) await interaction.reply({ content: 'No estas en un canal', ephemeral: true })

    await interaction.deferReply()

    await player.play(voiceChannel, song, {
      member: interaction.member,
      textChannel: interaction.channel
    })

    interaction.deleteReply()
  }
}
