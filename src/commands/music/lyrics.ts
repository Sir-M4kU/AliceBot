import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { type GuildIdResolvable } from "distube";
import { NO_LYRICS } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Search song lyrics")
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription(
					"Song name to find the lyrics. (If there is something playing will use the song)",
				)
				.setRequired(false),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		);
		const song = interaction.options.getString("song");

		if (queue) {
			const currentSong = queue.songs[0].name ?? "";
			const [findedSong] =
				await interaction.client.genius.songs.search(currentSong);
			const lyrics = await findedSong.lyrics();
			const embed = new EmbedBuilder()
				.setTitle(`Lyrics of ${findedSong.title}`)
				.setThumbnail(findedSong.thumbnail)
				.setDescription(lyrics)
				.setColor("DarkPurple");
			await defer.edit({ embeds: [embed] });
			return;
		}
		if (song) {
			const [findedSong] = await interaction.client.genius.songs.search(song);
			const lyrics = await findedSong.lyrics();
			const embed = new EmbedBuilder()
				.setTitle(`Lyrics of ${findedSong.title}`)
				.setThumbnail(findedSong.thumbnail)
				.setDescription(lyrics)
				.setColor("DarkPurple");
			await defer.edit({ embeds: [embed] });
			return;
		}

		await defer.edit({ embeds: [NO_LYRICS] });
		setTimeout(async () => await defer.delete(), 4000);
	},
};
