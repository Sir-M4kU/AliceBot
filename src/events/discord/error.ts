import { Events } from "discord.js";

export default {
	name: Events.Error,
	async execute(e: Error) {
		console.error(e);
	},
};
