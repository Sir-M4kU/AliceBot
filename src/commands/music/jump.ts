import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { Queue, type GuildIdResolvable } from "distube";
import { NEXT_SONG_ERR, PREV_SONG_ERR } from "../../utils/embeds.js";
import { validate } from "../../utils/utils.js";

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
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		) as Queue;
		const option = interaction.options.getInteger("song") ?? 0;
		const { invalid, message } = validate(interaction);

		if (invalid) {
			await defer.edit(message);
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
