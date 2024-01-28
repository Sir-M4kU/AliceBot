import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type GuildMember,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_CHANNEL, NO_QUEUE } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips to the next song"),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const {
			voice: { channel, guild },
		} = interaction.member as GuildMember;
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);

		if (guild.id !== interaction.guildId || !channel) {
			await defer.edit({ embeds: [NO_CHANNEL] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}
		if (!queue) {
			await defer.edit({ embeds: [NO_QUEUE] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		await queue.skip();
		await defer.delete();
	},
};
