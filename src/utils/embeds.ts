import { EmbedBuilder } from "discord.js";

export const NO_QUEUE = new EmbedBuilder()
	.setTitle("There is nothing playing right now")
	.setDescription("Please, add songs to use this command")
	.setColor(0xd51f24);

export const SELECT_OK = new EmbedBuilder()
	.setTitle("Selection received")
	.setColor(0x51bb67)
	.setDescription("Loading song...");

export const SELECT_END = new EmbedBuilder()
	.setTitle("Selection not received, cancelling...")
	.setDescription("Please, try again")
	.setColor(0xd10a15);
