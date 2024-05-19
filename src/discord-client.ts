import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user?.username}!`);
});

export { client };
