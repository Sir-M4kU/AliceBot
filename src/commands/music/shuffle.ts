import {
	SlashCommandBuilder,
	EmbedBuilder,
	type ChatInputCommandInteraction,
	type GuildMember,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { COLORS, NO_CHANNEL, NO_QUEUE } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffle the queue"),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const {
			voice: { channel },
		} = interaction.member as GuildMember;
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);

		if (!channel) {
			await defer.edit({ embeds: [NO_CHANNEL] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}
		if (!queue) {
			await defer.edit({ embeds: [NO_QUEUE] });
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
