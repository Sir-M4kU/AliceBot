const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde mostrando la latencia del bot.'),
	async execute(interaction) {
		await interaction.reply({ content: `¡Pong!\nLa latencia fue de: ${interaction.client.ws.ping}ms.`, ephemeral: true });
	},
};