import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ComponentType,
} from "discord.js";
import { Queue, type GuildIdResolvable } from "distube";
import { NO_QUEUE } from "../../utils/embeds.js";
import { DISCORD_CLYDE } from "../../utils/index.js";
import {
	LOOP_BUTTON,
	NEXT_PAGE_BUTTON,
	PREV_PAGE_BUTTON,
	SHUFFLE_BUTTON,
	ID,
} from "../../utils/components.js";
import { validate } from "../../utils/utils.js";

export default {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Show the queue"),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const queue = interaction.client.distube.queues.get(
			interaction.guild as GuildIdResolvable,
		) as Queue;
		const { invalid, message } = validate(interaction);

		if (invalid) {
			await defer.edit(message);
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		const embed = (page: number) => {
			const songs = queue.songs
				.slice(page, page + 10)
				.map((song, i) => {
					const { name = "", formattedDuration = "" } = song;
					const id = page >= 10 ? i + page : i;
					const num = id === 0 ? "▶️" : `${id}.`;
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
				.setThumbnail(queue.songs[0]?.thumbnail ?? "")
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
		let currentPage = 0;
		const row = () => {
			return new ActionRowBuilder<ButtonBuilder>().addComponents(
				PREV_PAGE_BUTTON.setDisabled(currentPage === 0),
				NEXT_PAGE_BUTTON.setDisabled(currentPage + 10 > queue.songs.length),
				LOOP_BUTTON,
				SHUFFLE_BUTTON,
			);
		};
		const response = await defer.edit({
			embeds: [embed(0)],
			components: [row()],
		});
		const collector = response.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 30_000,
		});

		collector.on("collect", async (i) => {
			await i.deferUpdate();
			if (!queue.playing) {
				await response.edit({ embeds: [NO_QUEUE], components: [] });
				setTimeout(async () => await response.delete(), 4000);
				collector.stop();
				return;
			}
			if (i.customId === ID.PrevPage) {
				currentPage -= 10;

				await response.edit({
					embeds: [embed(currentPage)],
					components: [row()],
				});

				collector.resetTimer();
			} else if (i.customId === ID.NextPage) {
				currentPage += 10;

				await response.edit({
					embeds: [embed(currentPage)],
					components: [row()],
				});

				collector.resetTimer();
			} else if (i.customId === ID.Shuffle) {
				await queue.shuffle();
				await response.edit({ embeds: [embed(currentPage)] });
			} else if (i.customId === ID.Loop) {
				queue.setRepeatMode();

				await response.edit({ embeds: [embed(currentPage)] });
			}
		});
		collector.once("end", async (_, reason) => {
			if (reason === ID.Stop) return;

			if (!queue.playing) {
				await response.edit({ embeds: [NO_QUEUE], components: [] });
				setTimeout(async () => await response.delete(), 4000);
			} else {
				await response.edit({ embeds: [embed(currentPage)], components: [] });
			}
		});
	},
};
