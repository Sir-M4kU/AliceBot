import {
	REST,
	Routes,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import {
	initDiscordConfig,
	loadHandlers,
	COMMANDS_PATH,
} from "./utils/index.js";
import type { SlashCommand } from "./types.js";

const { DISCORD_CLIENT_ID, DISCORD_TOKEN } = initDiscordConfig();
const commands = await loadHandlers<SlashCommand>(COMMANDS_PATH);
const commandsJSON: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

for (const command of commands) {
	if ("data" in command && "execute" in command) {
		commandsJSON.push(command.data.toJSON());
	} else {
		console.log(
			`The command ${command} is missing a required "data" or "execute" property`,
		);
	}
}
try {
	console.log(`Refreshing ${commandsJSON.length} commands...`);

	const data = (await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
		body: commandsJSON,
	})) as unknown[];

	console.log(`Successfully reloaded ${data.length} commands`);
} catch (e) {
	console.log(e);
	process.exit(1);
}
