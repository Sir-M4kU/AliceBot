import {
	SlashCommandBuilder,
	EmbedBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { Queue, type GuildIdResolvable } from "distube";
import { COLORS } from "../../utils/embeds.js";
import { validate } from "../../utils/utils.js";

export default {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffle the queue"),
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

		const embed = new EmbedBuilder()
			.setTitle("Queue shuffled")
			.setColor(COLORS.Pink);

		await queue.shuffle();
		await defer.edit({ embeds: [embed] });
		setTimeout(async () => await defer.delete(), 4000);
	},
};
