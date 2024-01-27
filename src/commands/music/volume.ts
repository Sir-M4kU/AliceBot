import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	type GuildMember,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { COLORS, NO_CHANNEL, NO_QUEUE } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Changes the volume")
		.addNumberOption((option) =>
			option
				.setName("volume")
				.setDescription("The volume quantity")
				.setMinValue(0)
				.setMaxValue(100)
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);
		const {
			voice: { channel },
		} = interaction.member as GuildMember;

		if (!channel) {
			await defer.edit({ embeds: [NO_CHANNEL] });
			setTimeout(async () => await defer.delete(), 4000);
		}
		if (!queue) {
			await defer.edit({ embeds: [NO_QUEUE] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		const value = interaction.options.getNumber("volume") ?? 50;
		queue.setVolume(value);

		await defer.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle("Volume changed")
					.setDescription(`Volume setted to \`${value}%\``)
					.setColor(COLORS.Green),
			],
		});
		setTimeout(async () => await defer.delete(), 4000);
	},
};
