import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type GuildMember,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import {
	NEXT_SONG_ERR,
	NO_CHANNEL,
	NO_QUEUE,
	PREV_SONG_ERR,
} from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("jump")
		.setDescription("Jump songs from queue")
		.addIntegerOption((option) =>
			option
				.setName("song")
				.setDescription("The song to change")
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const {
			voice: { channel, guild },
		} = interaction.member as GuildMember;
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);
		const option = interaction.options.getInteger("song") ?? 0;

		if (guild.id !== interaction.guildId || !channel) {
			await defer.edit({ embeds: [NO_CHANNEL] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}
		if (!queue) {
			await defer.edit({ embeds: [NO_QUEUE] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}
		if (option < queue.previousSongs.length) {
			await defer.edit({
				embeds: [PREV_SONG_ERR(option, queue.previousSongs.length)],
			});
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}
		if (option > queue.songs.length) {
			await defer.edit({ embeds: [NEXT_SONG_ERR(option, queue.songs.length)] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		await queue.jump(option);
		await defer.delete();
	},
};
