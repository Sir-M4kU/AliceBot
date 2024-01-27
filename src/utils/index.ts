import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

const {
	DISCORD_TOKEN = "",
	DISCORD_CLIENT_ID = "",
	ENV = "",
	SPOTIFY_CLIENT_ID = "",
	SPOTIFY_CLIENT_SECRET = "",
} = process.env;
const IS_PROD = ENV === "prod" ? "dist" : "src";
export const COMMANDS_PATH = path.join(process.cwd(), IS_PROD, "commands");
export const EVENTS_PATH = path.join(process.cwd(), IS_PROD, "events");
export const DISCORD_CLYDE =
	"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png";

export function initDiscordConfig() {
	if ((DISCORD_CLIENT_ID || DISCORD_TOKEN) === "") {
		console.log("DISCORD_CLIENT_ID/DISCORD_TOKEN environments not found");
		process.exit(1);
	}

	return {
		DISCORD_TOKEN,
		DISCORD_CLIENT_ID,
	};
}
export const initSpotifyConfig = () => ({
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
});

export async function loadHandlers<T>(handlerPath: string) {
	const handlers: T[] = [];
	try {
		const folders = await fs.readdir(handlerPath);

		for (const folder of folders) {
			const handlersPath = path.join(handlerPath, folder);
			const handlerFiles = await fs.readdir(handlersPath);

			for (const file of handlerFiles) {
				const filePath = path.join(handlersPath, file);
				const { default: event } = (await import(filePath)) as {
					default: T;
				};
				handlers.push(event);
			}
		}

		return handlers;
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}
