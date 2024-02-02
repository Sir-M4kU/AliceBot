import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { Queue, type GuildIdResolvable } from "distube";
import { validate } from "../../utils/utils.js";

export default {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips to the next song"),
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

		await queue.skip();
		await defer.delete();
	},
};
