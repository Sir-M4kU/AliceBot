const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pausa la cancion.'),
	async execute(interaction) {
		if (!interaction.member.voice.channelId) {
			return interaction.reply({ content: 'Primero entre a un canal.', ephemeral: true });
		}

		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return interaction.reply({ content: 'No estamos en el mismo canal...', ephemeral: true });
		}

		const queue = interaction.client.player.getQueue(interaction.guild.id);

		await interaction.deferReply();
		if (!queue || !queue.playing) {
			return interaction.editReply({ content: 'Aca no se esta escuchando nada...', ephemeral: true });
		}

		if (queue) {
			if (interaction.user.id !== queue.nowPlaying().requestedBy.id) {
				return interaction.editReply({ content: 'Solo el que pidio la cancion puede pausarla', ephemeral: true });
			}
			if (queue) {
				if (interaction.user.id !== queue.nowPlaying().requestedBy.id) {
					return interaction.editReply({ content: 'Solo el que pidio la cancion puede pausarla', ephemeral: true });
				}
			}
			const pause = queue.setPaused({ paused: true });
			return interaction.editReply(pause ? 'Se ha pausado la cancion.' : 'Error al pausar la cancion.');
		}
	},
};