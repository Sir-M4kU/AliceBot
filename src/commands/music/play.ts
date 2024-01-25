import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type VoiceState,
	type CacheType,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays music")
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription("A link or name of a song")
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const query = interaction.options.getString("song") ?? "";
		await interaction.reply("OK");
		if (/^http(s)?:\/\//gi.test(query)) {
			// await interaction.client.distube.play(
			// 	interaction.voice.channel.id,
			// 	query,
			// );
		}
	},
};
