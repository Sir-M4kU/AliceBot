import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { Queue, type GuildIdResolvable } from "distube";
import { COLORS } from "../../utils/embeds.js";
import { validate } from "../../utils/utils.js";

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
		) as Queue;
		const { invalid, message } = validate(interaction);

		if (invalid) {
			await defer.edit(message);
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
