import { Events, type Queue, type Song } from "distube";
import { EmbedBuilder, ActivityType } from "discord.js";

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
		const { volume } = queue;
		const embed = new EmbedBuilder()
			.setColor(0x6986b2)
			.setTitle("Now playing")
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
					value: volume.toString(),
					inline: true,
				},
			);

		queue.client.user?.setActivity({
			type: ActivityType.Streaming,
			name,
			url,
		});
		await queue.textChannel?.send({ embeds: [embed] });
	},
};
