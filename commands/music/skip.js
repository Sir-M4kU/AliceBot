const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Salta a la siguiente cancion.'),
	async execute(interaction) {
		const player = interaction.client.player;

		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'Primero entre a un canal.', ephemeral: true });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ content: 'No estamos en el mismo canal', ephemeral: true });
		}

		const queue = player.getQueue(interaction.guildId);
		await interaction.deferReply();

		if (!queue || !queue.playing) {
			return interaction.editReply({ content: 'No hay musica en la lista.', ephemeral: true });
		}

		const currentTrack = queue.nowPlaying().title;
		if (queue.tracks.length < 1) {
			return interaction.editReply('Solo hay una cancion');
		}
		const skip = queue.skip();
		return interaction.editReply(skip ? `La cancion **${currentTrack}** fue saltada.` : 'Error al ejecutar el comando');
	},
};