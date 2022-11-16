const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Reanuda la cancion'),
	async execute(interaction) {
		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'Primero entre a un canal.', ephemeral: true });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ content: 'No estamos en el mismo canal', ephemeral: true });
		}

		const queue = interaction.client.player.getQueue(interaction.guild.id);
		await interaction.deferReply();

		if (!queue || !queue.playing) {
			return interaction.editReply({ content: 'No hay musica en la lista.', ephemeral: true });
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
			const resume = await queue.setPaused(false);
			return await interaction.editReply(resume ? 'La cancion se ha reanudado' : 'Ha ocurrido un error al reanudar.');
		}
	},
};