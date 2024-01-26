import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type GuildMember,
	type GuildTextBasedChannel,
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ComponentType,
} from "discord.js";
import { SearchResultType, isURL, type GuildIdResolvable } from "distube";
import { SELECT_END, SELECT_OK } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays music")
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription("A link or name of a song")
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const query = interaction.options.getString("song") ?? "";
		const {
			voice: { channel },
		} = interaction.member as GuildMember;
		const { distube: player } = interaction.client;
		await interaction.deferReply();

		if (!channel) {
			const msg = await interaction.followUp({
				content: "You need to be in a channel to use this command",
			});

			setTimeout(async () => await msg.delete(), 4000);

			return;
		}

		if (isURL(query)) {
			await player.play(channel, query, {
				member: interaction.member as GuildMember,
				textChannel: interaction.channel as GuildTextBasedChannel,
			});
			await interaction.deleteReply();
		} else {
			const results = await player.search(query, {
				safeSearch: false,
				type: SearchResultType.VIDEO,
			});
			const strResults = results
				.map((song, i) => {
					const { name, formattedDuration } = song;

					return `${i + 1}. \t ${name} | ${formattedDuration}\n`;
				})
				.toString()
				.replace(/,/gi, "");
			const embed = new EmbedBuilder()
				.setTitle("Choose an option from below")
				.setDescription(strResults)
				.setColor(0x26619c);
			const select = new StringSelectMenuBuilder()
				.setCustomId("play-search")
				.setPlaceholder("Select an option...")
				.addOptions(
					...results.map((song, i) => {
						const { name, url } = song;
						return new StringSelectMenuOptionBuilder()
							.setLabel((i + 1).toString())
							.setDescription(name)
							.setValue(url);
					}),
				);
			const row = new ActionRowBuilder<typeof select>().addComponents(select);

			const msg = await interaction.followUp({
				embeds: [embed],
				components: [row],
			});

			const collector = msg.createMessageComponentCollector({
				componentType: ComponentType.StringSelect,
				time: 30_000,
			});

			collector.on("collect", async (i) => {
				const selection = i.values[0];
				const confirmMsg = await interaction.editReply({
					embeds: [SELECT_OK],
					components: [],
				});
				await player.play(channel, selection, {
					member: i.member as GuildMember,
					textChannel: i.channel as GuildTextBasedChannel,
				});
				await confirmMsg.delete();
			});
			collector.once("end", async (collected) => {
				if (collected.size > 0) return;
				const msgEnded = await interaction.editReply({
					embeds: [SELECT_END],
					components: [],
				});
				setTimeout(async () => await msgEnded.delete(), 4000);
			});
		}
	},
};