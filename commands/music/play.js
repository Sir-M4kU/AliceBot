const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'Primero entre a un canal.', ephemeral: true });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ content: 'No estamos en el mismo canal', ephemeral: true });
		}
		const query = interaction.options.getString('cancion');
		const queue = interaction.client.player.createQueue(interaction.guild, {
			ytdlOptions: {
				quality: 'highestaudio',
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			metadata: {
				channel: interaction.channel,
			},
			initialVolume: 30,
			spotifyBridge: true,
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
		});

		const playEmbed = new EmbedBuilder()
			.setColor('DarkAqua')
			.setTitle(`Se ha añadido la ${track.playlist ? 'playlist' : 'cancion'} a la lista.`)
			.setThumbnail()
			.setFields();
		if (!track.playlist) {
			const tr = track.tracks[0];
			playEmbed.setThumbnail(tr.thumbnail);
			playEmbed.setDescription(`${tr.title}`);
			playEmbed.setFields(
				{ name: 'Pedida por', value: `${tr.requestedBy}` },
			);
		}

		if (!queue.playing) {
			track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0]);
			await queue.play();
			return await interaction.editReply({ embeds: [playEmbed] });
		}
		else if (queue.playing) {
			track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0]);
			await queue.play();
			return await interaction.editReply({ embeds: [playEmbed] });
		}
		if (!track) return await interaction.editReply(`No encontre la cancion **${query}**`);
	},
};