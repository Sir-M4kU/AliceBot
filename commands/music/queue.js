const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Muestra la lista de reproduccion.'),
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

		const currentTrack = queue.current;

		const tracks = queue.tracks.slice(0, 10).map((m, i) => {
			return `${i + 1}. **${m.title}** ([link](${m.url}))`;
		});
		const queueEmbed = new EmbedBuilder()
			.setColor('DarkBlue')
			.setTitle('Lista de reproduccion')
			.setDescription(`__**Escuchando ahora mismo: ${currentTrack.title}**__\n${tracks.join('\n')}${queue.tracks.length > tracks.length
				? `\n..${
					queue.tracks.length - tracks.length === 1
						? `${queue.tracks.length - tracks.length} y mas canciones`
						: `${queue.tracks.length - tracks.length} y mas canciones`
				}`
				: ''
			}`)
			.setThumbnail(currentTrack.thumbnail);
		return interaction.editReply({ embeds: [queueEmbed] });
	},
};