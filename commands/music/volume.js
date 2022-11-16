const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Sube o baja el volumen')
		.addIntegerOption(option =>
			option
				.setName('cantidad')
				.setDescription('Del 1 al 100')
				.setRequired(true),
		),
	async execute(interaction) {
		const player = interaction.client.player;

		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'Primero entre a un canal.', ephemeral: true });
		}
		if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ content: 'No estamos en el mismo canal.', ephemeral: true });
		}

		const queue = player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return interaction.reply({ content: 'Aca no se esta escuchando nada...', ephemeral: true });
		}

		const volume = interaction.options.getInteger('cantidad');

		await interaction.deferReply();
		if (queue) {
			if (!volume) {
				return interaction.editReply(`El volumen esta en ${queue.volume}`);
			}
			if (volume.value < 0 || volume.value > 100) {
				return interaction.editReply({ content: 'El rango debe estar entre 1 a 100', ephemeral: true });
			}
			const vol = await queue.setVolume(volume);
			return interaction.editReply(vol ? `El volumen ahora es ${volume}%` : 'No puedo hacer eso');
		}
	},
};