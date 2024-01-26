import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_QUEUE } from "../../utils/embeds.js";

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
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);
		await interaction.deferReply();

		if (!queue) {
			const msg = await interaction.editReply({ embeds: [NO_QUEUE] });
			setTimeout(async () => await msg.delete(), 4000);
			return;
		}
		const value = interaction.options.getNumber("volume") ?? 50;
		queue.setVolume(value);

		const msg = await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Volume changed")
					.setDescription(`Volume setted to \`${value}%\``),
			],
		});
		setTimeout(async () => await msg.delete(), 4000);
	},
};
