import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export const ID = {
	Play: "play",
	Stop: "stop",
	Prev: "prev",
	Next: "skip",
} as const;

export const PLAY_BUTTON = new ButtonBuilder()
	.setCustomId(ID.Play)
	.setEmoji("⏯️")
	.setStyle(ButtonStyle.Primary);
export const STOP_BUTTON = new ButtonBuilder()
	.setCustomId(ID.Stop)
	.setEmoji("⏹️")
	.setStyle(ButtonStyle.Danger);
export const PREV_BUTTON = new ButtonBuilder()
	.setCustomId(ID.Prev)
	.setEmoji("⏮️")
	.setStyle(ButtonStyle.Secondary);
export const NEXT_BUTTON = new ButtonBuilder()
	.setCustomId(ID.Next)
	.setEmoji("⏭️")
	.setStyle(ButtonStyle.Secondary);

export const PLAYER_ROW = new ActionRowBuilder<ButtonBuilder>().addComponents(
	PREV_BUTTON,
	PLAY_BUTTON,
	STOP_BUTTON,
	NEXT_BUTTON,
);
