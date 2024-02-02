import { EmbedBuilder, type GuildMember } from "discord.js";
import { Events, type Queue } from "distube";

export default {
	name: Events.EMPTY,
	distubeEvent: true,
	async execute(queue: Queue) {
		const guildQueue = queue.queues.get(queue.clientMember as GuildMember);
		if (!guildQueue) return;
		const msg = await guildQueue.textChannel?.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("Voice channel empty, leaving...")
					.setColor(0xed3ea9),
			],
		});
		setTimeout(async () => await msg?.delete(), 4000);
	},
};
