import type {
	ChatInputCommandInteraction,
	Collection,
	SlashCommandBuilder,
	CacheType,
	ClientEvents,
} from "discord.js";
import type { DisTube, DisTubeEvents } from "distube";

export interface SlashCommand {
	data: SlashCommandBuilder;
	execute: (
		interaction: ChatInputCommandInteraction<CacheType>,
	) => Promise<void>;
}

export interface DiscordEvent {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: ClientEvents[keyof ClientEvents]) => Promise<void>;
}
export interface DistubeEvent {
	name: keyof DisTubeEvents;
	distubeEvent: boolean;
	execute: (...args: DisTubeEvents[keyof DisTubeEvents]) => Promise<void>;
}

export type Event = DistubeEvent | DiscordEvent;

declare module "discord.js" {
	export interface Client {
		commands: Collection<string, SlashCommand>;
		distube: DisTube;
	}
}
