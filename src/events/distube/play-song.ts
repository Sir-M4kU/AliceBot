import { Events, type Queue, type Song } from "distube";
import {
	ComponentType,
	EmbedBuilder,
	Message,
	ActionRowBuilder,
	type ButtonBuilder,
} from "discord.js";
import {
	ID,
	NEXT_BUTTON,
	PLAY_BUTTON,
	PREV_BUTTON,
	STOP_BUTTON,
} from "../../utils/components.js";
import { STOP } from "../../utils/embeds.js";

export default {
	name: Events.PLAY_SONG,
	distubeEvent: true,
	async execute(queue: Queue, song: Song) {
		const {
			user,
			name = "",
			isLive,
			formattedDuration = "",
			thumbnail = "",
			url,
		} = song;
		const embed = () => {
			const msg = queue.paused ? "Paused" : "Now playing";

			return new EmbedBuilder()
				.setColor(0x6986b2)
				.setTitle(msg)
				.setDescription(name)
				.setImage(thumbnail)
				.setURL(url)
				.addFields(
					{ name: "Requested by", value: `${user}`, inline: true },
					{
						name: "Duration",
						value: isLive ? "LIVE" : formattedDuration,
						inline: true,
					},
					{
						name: "Volume",
						value: queue.volume.toString(),
						inline: true,
					},
				);
		};
		if (queue.textChannel) {
			const row = () => {
				const prev = queue.previousSongs.length > 0;
				const next = queue.songs.length > 1;
				return new ActionRowBuilder<ButtonBuilder>().addComponents(
					PREV_BUTTON.setDisabled(!prev),
					PLAY_BUTTON,
					STOP_BUTTON,
					NEXT_BUTTON.setDisabled(!next),
				);
			};
			const response = await queue.textChannel.send({
				embeds: [embed()],
				components: [row()],
			});
			const collector = response.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: song.duration * 1000,
			});
			let deleted = false;

			collector.on("collect", async (i) => {
				await i.deferUpdate();
				let msg: Message<boolean>;

				if (i.customId === ID.Play) {
					if (queue.paused) {
						collector.resetTimer({
							time: (song.duration - Math.floor(queue.currentTime)) * 1000,
						});
						queue.resume();
					} else {
						collector.resetTimer({ time: 60_000 });
						queue.pause();
					}
					await response.edit({
						embeds: [embed()],
						components: [row()],
					});
				} else if (i.customId === ID.Stop) {
					await queue.stop();
					msg = await i.followUp({ embeds: [STOP] });
					deleted = true;
					collector.stop(ID.Stop);
				} else if (i.customId === ID.Prev) {
					await queue.previous();
					collector.stop(ID.Prev);
				} else if (i.customId === ID.Next) {
					await queue.skip();
					collector.stop(ID.Next);
				}
				if (deleted) setTimeout(async () => await msg.delete(), 4000);
			});
			collector.once("end", async () => {
				await response.delete();
			});
		}
	},
};
