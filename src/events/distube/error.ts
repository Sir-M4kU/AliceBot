import { Events } from "distube";
import type { BaseGuildTextChannel } from "discord.js";

export default {
	name: Events.ERROR,
	distubeEvent: true,
	async execute(channel: BaseGuildTextChannel, e: Error) {
		console.log(e);
		if (channel) await channel.send({ content: "An error ocurred" });
	},
};
