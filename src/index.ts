import { Client, GatewayIntentBits, Collection } from "discord.js";
import { DisTube, type DisTubeEvents } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import {
	initDiscordConfig,
	initSpotifyConfig,
	loadHandlers,
	EVENTS_PATH,
	COMMANDS_PATH,
} from "./utils/index.js";
import type { Event, SlashCommand } from "./types.js";

const { DISCORD_TOKEN } = initDiscordConfig();
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = initSpotifyConfig();
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
const [events, commands] = await Promise.all([
	loadHandlers<Event>(EVENTS_PATH),
	loadHandlers<SlashCommand>(COMMANDS_PATH),
]);

client.commands = new Collection();
client.distube = new DisTube(client, {
	nsfw: true,
	emitNewSongOnly: true,
	leaveOnStop: false,
	searchSongs: 10,
	ytdlOptions: {
		highWaterMark: 1 << 20,
		quality: "highestaudio",
	},
	plugins: [
		new SpotifyPlugin({
			api: {
				clientId: SPOTIFY_CLIENT_ID,
				clientSecret: SPOTIFY_CLIENT_SECRET,
			},
		}),
		new SoundCloudPlugin(),
	],
});

for (const event of events) {
	if ("distubeEvent" in event) {
		client.distube.on(
			event.name,
			async (...args: DisTubeEvents[keyof DisTubeEvents]) =>
				await event.execute(...args),
		);
	} else {
		if (event.once) {
			client.once(event.name, async (...args) => await event.execute(...args));
		} else {
			client.on(event.name, async (...args) => await event.execute(...args));
		}
	}
}
for (const command of commands) {
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(
			`The command ${command} is missing a required "data" or "execute" property`,
		);
	}
}

await client.login(DISCORD_TOKEN);
