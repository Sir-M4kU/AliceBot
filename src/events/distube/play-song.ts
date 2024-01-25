import { Events, type Queue, type Song } from "distube";
import { EmbedBuilder } from "discord.js";

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
		} = song;
		const embed = new EmbedBuilder()
			.setColor(0x6986b2)
			.setTitle("Now playing")
			.setDescription(name)
			.setImage(thumbnail)
			.addFields(
				{ name: "Requested by", value: `${user}` },
				{ name: "Duration", value: isLive ? "LIVE" : formattedDuration },
			);

		await queue.textChannel?.send({ embeds: [embed] });
	},
};
