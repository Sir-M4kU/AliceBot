import { Events, type Queue } from "distube";
import { ActivityType, EmbedBuilder } from "discord.js";

export default {
	name: Events.DISCONNECT,
	distubeEvent: true,
	async execute(queue: Queue) {
		const embed = new EmbedBuilder()
			.setTitle("Disconnected from VC")
			.setDescription("Queue cleared")
			.setColor(0xdd4935);
		queue.client.user?.setActivity({
			type: ActivityType.Listening,
			name: "new interactions",
		});
		await Promise.all([
			queue.stop(),
			queue.textChannel?.send({ embeds: [embed] }),
		]);
	},
};
