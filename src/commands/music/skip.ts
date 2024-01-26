import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_QUEUE } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips to the next song"),
	async execute(interaction: ChatInputCommandInteraction) {
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);
		await interaction.deferReply();

		if (!queue) {
			const msg = await interaction.editReply({ embeds: [NO_QUEUE] });
			setTimeout(async () => await msg.delete(), 4000);
			return;
		}

		await queue.skip();
		await interaction.deleteReply();
	},
};
