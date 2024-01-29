import { ChatInputCommandInteraction, type GuildMember } from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_CHANNEL, NO_QUEUE } from "./embeds.js";

export function validate(interaction: ChatInputCommandInteraction) {
	const queue = interaction.client.distube.queues.get(
		interaction.guild as GuildIdResolvable,
	);
	const {
		voice: { channel, guild },
	} = interaction.member as GuildMember;
	if (guild.id !== interaction.guildId || !channel) {
		return { invalid: true, message: { embeds: [NO_CHANNEL] } };
	}
	if (!queue) {
		return { invalid: true, message: { embeds: [NO_QUEUE] } };
	}
	return { invalid: false, message: { embeds: [] } };
}
