import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { Queue, type GuildIdResolvable } from "distube";
import { STOP } from "../../utils/embeds.js";
import { validate } from "../../utils/utils.js";

export default {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop and clears the queue"),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		) as Queue;
		const { invalid, message } = validate(interaction);

		if (invalid) {
			await defer.edit(message);
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		await queue.stop();
		await defer.edit({ embeds: [STOP] });
		setTimeout(async () => await defer.delete(), 4000);
	},
};
