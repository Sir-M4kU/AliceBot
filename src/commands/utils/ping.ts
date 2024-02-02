import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type CacheType,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Respond with a pong and the latency"),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		await interaction.reply(`Pong!\nLatency: ${interaction.client.ws.ping}ms`);
	},
};
