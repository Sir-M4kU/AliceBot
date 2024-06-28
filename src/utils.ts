import path from "node:path";
import fs from "node:fs/promises";
import { Collection } from "discord.js";

import type { Command } from "./types.js";

async function loader<T>(folder: "events" | "commands") {
	const arr: T[] = [];
	const loadersPath = path.join(import.meta.dirname, folder);
	const loaders = await fs.readdir(loadersPath);

	for (const loader of loaders) {
		const foldersPath = path.join(loadersPath, loader);
		const folders = await fs.readdir(foldersPath);

		for (const file of folders) {
			const filePath = path.join(foldersPath, file);
			const { default: fileJs } = (await import(filePath)) as { default: T };
			arr.push(fileJs);
		}
	}

	return arr;
}

const commands = new Collection<string, Command>();
const commandFiles = await loader<Command>("commands");

for (const command of commandFiles) {
	commands.set(command.data.name, command);
}

export { loader, commands };
