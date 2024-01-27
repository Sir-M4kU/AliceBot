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
			return;
		}
		if (!queue) {
			await defer.edit({ embeds: [NO_QUEUE] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		const option = interaction.options.getNumber("mode") ?? 0;
		const loopSet = queue.setRepeatMode(option);
		const loopMsg =
			loopSet > 0 ? (loopSet === 2 ? "Queue" : "This song") : "Off";
		const embed = new EmbedBuilder()
			.setTitle("Loop changed")
			.setDescription(`Loop has changed to ${loopMsg}`)
			.setColor(COLORS.Blue);

		await defer.edit({ embeds: [embed] });
		setTimeout(async () => await defer.delete(), 4000);
	},
};
