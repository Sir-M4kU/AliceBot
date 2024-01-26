import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { type GuildIdResolvable, RepeatMode } from "distube";
import { NO_QUEUE } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Enable loop mode to the current song or queue")
		.addNumberOption((option) =>
			option
				.setName("mode")
				.setDescription("Set the loop mode")
				.setMinValue(0)
				.setMaxValue(2)
				.addChoices(
					{ name: "Disable", value: 0 },
					{ name: "Song", value: 1 },
					{ name: "Queue", value: 2 },
				)
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);

		if (!queue) {
			const msg = await interaction.editReply({ embeds: [NO_QUEUE] });
			setTimeout(async () => await msg.delete(), 4000);
			return;
		}
		const option = interaction.options.getNumber("mode") ?? 0;
		const loopSet = queue.setRepeatMode(option);
		const loopMsg =
			loopSet > 0 ? (loopSet === 2 ? "Queue" : "This song") : "Off";
		const embed = new EmbedBuilder()
			.setTitle("Loop changed")
			.setDescription(`Loop has changed to ${loopMsg}`)
			.setColor(0x8e52e1);

		const msg = await interaction.editReply({ embeds: [embed] });
		setTimeout(async () => await msg.delete(), 4000);
	},
};
