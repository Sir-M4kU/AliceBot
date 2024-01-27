import { EmbedBuilder } from "discord.js";
import { Events, type Queue } from "distube";

export default {
	name: Events.FINISH,
	distubeEvent: true,
	async execute(queue: Queue) {
		const embed = new EmbedBuilder()
			.setTitle("Queue finished")
			.setDescription(
				"Add more songs or disconnect the bot if you don't want to listen more",
			)
			.setColor(0xffac2a);
		const msg = await queue.textChannel?.send({ embeds: [embed] });
		setTimeout(async () => await msg?.delete(), 4000);
	},
};
