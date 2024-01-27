import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type GuildMember,
	EmbedBuilder,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { COLORS, NO_CHANNEL, NO_QUEUE, STOP } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop and clears the queue"),
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

		await queue.stop();
		await defer.edit({ embeds: [STOP] });
		setTimeout(async () => await defer.delete(), 4000);
	},
};
