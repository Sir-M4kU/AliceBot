import { Client, ActivityType, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";

import { loader } from "./utils.js";
import type { Event } from "./types.js";

const events = await loader<Event>("events");
const bot = new Client({
	intents: [GatewayIntentBits.GuildVoiceStates],
	presence: {
		activities: [
			{
				name: "for interactions",
				type: ActivityType.Watching
			}
		]
	}
});
const player = new Player(bot);

await player.extractors.loadDefault();

for (const event of events) {
	if ("isPlayer" in event)
		player.events.on(
			event.name,
			async (...args) => await event.execute(...args)
		);

	if ("once" in event)
		bot.once(event.name, async (...args) => await event.execute(...args));
	else bot.on(event.name, async (...args) => await event.execute(...args));
}

export { bot };
