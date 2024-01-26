import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_QUEUE } from "../../utils/embeds.js";
import { DISCORD_CLYDE } from "../../utils/index.js";

export default {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Show the queue"),
	async execute(interaction: ChatInputCommandInteraction) {
		const queue = interaction.client.distube.queues.get(
			interaction.guild as GuildIdResolvable,
		);

		await interaction.deferReply();

		if (!queue) {
			const msg = await interaction.editReply({ embeds: [NO_QUEUE] });
			setTimeout(async () => await msg.delete(), 4000);
			return;
		}

		const songs = queue.songs
			.slice(0, 20)
			.map((song, i) => {
				const { name = "", formattedDuration = "" } = song;
				return `${i + 1}. \t ${name} - ${formattedDuration}\n`;
			})
			.toString()
			.replace(/,/gi, "");
		const loopMode =
			queue.repeatMode > 0
				? queue.repeatMode === 2
					? "Queue"
					: "This song"
				: "Off";
		const embed = new EmbedBuilder()
			.setAuthor({
				name: `Queue of ${interaction.guild?.name}`,
				iconURL: interaction.guild?.iconURL({ size: 32 }) ?? DISCORD_CLYDE,
			})
			.setThumbnail(queue.songs[0].thumbnail ?? "")
			.setDescription(songs)
			.addFields(
				{ name: "Volume", value: queue.volume.toString(), inline: true },
				{ name: "Loop mode", value: loopMode, inline: true },
				{
					name: "Queue duration",
					value: queue.formattedDuration,
					inline: true,
				},
			);
		await interaction.editReply({ embeds: [embed] });
	},
};
