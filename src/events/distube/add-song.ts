import { Events, type Queue, type Song } from "distube";
import { EmbedBuilder } from "discord.js";

export default {
	name: Events.ADD_SONG,
	distubeEvent: true,
	async execute(queue: Queue, song: Song) {
		const {
			user,
			isLive,
			name = "",
			thumbnail = "",
			formattedDuration = "",
		} = song;

		const embed = new EmbedBuilder()
			.setColor(0x56d85a)
			.setTitle("Added to queue")
			.setDescription(name)
			.setImage(thumbnail)
			.addFields(
				{ name: "Requested by", value: `${user}` },
				{ name: "Duration", value: isLive ? "LIVE" : formattedDuration },
			);

		await queue.textChannel?.send({ embeds: [embed] });
	},
};
