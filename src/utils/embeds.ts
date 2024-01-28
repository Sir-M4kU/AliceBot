import { EmbedBuilder } from "discord.js";

export const COLORS = {
	Red: 0xff0000,
	Blue: 0x003366,
	Yellow: 0xffff00,
	Green: 0x00ff00,
	Purple: 0x800080,
	Pink: 0xf6546a,
} as const;

export const NO_QUEUE = new EmbedBuilder()
	.setTitle("There is nothing playing right now")
	.setDescription("Please, add songs to use this command")
	.setColor(COLORS.Red);

export const SELECT_OK = new EmbedBuilder()
	.setTitle("Selection received")
	.setColor(COLORS.Green)
	.setDescription("Loading song...");

export const SELECT_END = new EmbedBuilder()
	.setTitle("Selection not received, cancelling...")
	.setDescription("Please, try again")
	.setColor(COLORS.Red);

export const NO_CHANNEL = new EmbedBuilder()
	.setTitle("No channel detected")
	.setDescription("You need to be in a channel to use this command")
	.setColor(COLORS.Red);

export const RESUME = new EmbedBuilder()
	.setTitle("Queue resumed")
	.setColor(COLORS.Yellow);
export const PAUSE = new EmbedBuilder()
	.setTitle("Queue paused")
	.setColor(COLORS.Yellow);
export const STOP = new EmbedBuilder()
	.setTitle("Queue stopped and cleared")
	.setDescription("You can add new songs or just disconnect the bot")
	.setColor(COLORS.Red);
export const SKIP = new EmbedBuilder()
	.setTitle("Song skipped")
	.setColor(COLORS.Blue);
export const PREV = new EmbedBuilder()
	.setTitle("Back to previous song")
	.setColor(COLORS.Blue);

export const PREV_SONG_ERR = (pos: number, max: number) =>
	new EmbedBuilder()
		.setTitle("Jump failed")
		.setDescription(
			`You tried to jump ${pos} song but there is only ${max} previous songs`,
		)
		.setColor(COLORS.Red);
export const NEXT_SONG_ERR = (pos: number, max: number) =>
	new EmbedBuilder()
		.setTitle("Jump failed")
		.setDescription(
			`You tried to jump ${pos} song but there is only ${max} songs left`,
		)
		.setColor(COLORS.Red);
