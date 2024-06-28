import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	ClientEvents,
	SlashCommandBuilder
} from "discord.js";
import type { GuildQueueEvents } from "discord-player";

interface Command {
	data: SlashCommandBuilder;

	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

interface DiscordEvent<EventName extends keyof ClientEvents> {
	name: EventName;
	once?: true;

	execute: (...args: ClientEvents[EventName]) => Promise<void>;
}

interface PlayerEvent<EventName extends keyof GuildQueueEvents> {
	name: EventName;
	isPlayer: true;
	execute: GuildQueueEvents<ChatInputCommandInteraction>[EventName];
}

// biome-ignore lint: implicit any
type Event = DiscordEvent<any> | PlayerEvent<any>;

export type { Command, Event, DiscordEvent, PlayerEvent };
