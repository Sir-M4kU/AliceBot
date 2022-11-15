const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce una cancion')
		.addStringOption(option =>
			option
				.setName('cancion')
				.setDescription('Introduce el link/Nombre de la Cancion')
				.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: 'No estas en ningun canal', ephemeral: true });
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: 'No estamos en el mismo canal', ephemeral: true });

		const query = interaction.options.getString('cancion');
		const queue = interaction.client.player.createQueue(interaction.guild, {
			ytdlOptions: {
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			metadata: {
				channel: interaction.channel,
			},
			leaveOnEnd: false,
		});

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch {
			queue.destroy();
			return await interaction.reply({ content: 'No puedo entrar al canal', ephemeral: true });
		}

		await interaction.deferReply();
		const track = await interaction.client.player.search(query, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		}).then(x => x.tracks[0]);
		if (!track) return await interaction.editReply(`No encontre la cancion **${query}**`);
		queue.play(track);
		return await interaction.editReply({ content: `Cargando cancion **${track.title}**.` });
	},
};