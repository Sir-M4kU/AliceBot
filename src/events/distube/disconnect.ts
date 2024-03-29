import { Events, type Queue } from "distube";
import { EmbedBuilder } from "discord.js";

export default {
	name: Events.DISCONNECT,
	distubeEvent: true,
	async execute(queue: Queue) {
		const embed = new EmbedBuilder()
			.setTitle("Disconnected from VC")
			.setDescription("Queue cleared")
			.setColor(0xdd4935);
		await Promise.all([
			queue.stop(),
			queue.textChannel?.send({ embeds: [embed] }).then((msg) => {
				setTimeout(async () => msg.delete(), 4000);
			}),
		]);
	},
};
