import { Events, Client, ActivityType } from "discord.js";

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: Client<true>) {
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setActivity({
			type: ActivityType.Listening,
			name: "new interactions...",
		});
	},
};
