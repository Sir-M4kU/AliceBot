import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	type GuildMember,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_CHANNEL, NO_QUEUE } from "../../utils/embeds.js";
import { DISCORD_CLYDE } from "../../utils/index.js";

export default {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Show the queue"),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const queue = interaction.client.distube.queues.get(
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

		const embed = () => {
			const songs = queue.songs
				.slice(0, 20)
				.map((song, i) => {
					const { name = "", formattedDuration = "" } = song;
					const id = i + 1;
					const num = id === 1 ? "▶️" : `${id}.`;
					return `${num} \t ${name} - ${formattedDuration}\n`;
				})
				.toString()
				.replace(/,/gi, "");
			const loopMode =
				queue.repeatMode > 0
					? queue.repeatMode === 2
						? "Queue"
						: "This song"
					: "Off";
			return new EmbedBuilder()
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
		};
		await defer.edit({ embeds: [embed()] });
	},
};
