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
import { SearchResultType, isURL } from "distube";
import { NO_CHANNEL, SELECT_END, SELECT_OK } from "../../utils/embeds.js";

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
			voice: { channel, guild },
		} = interaction.member as GuildMember;
		const { distube: player } = interaction.client;
		const defer = await interaction.deferReply();

		if (guild.id !== interaction.guildId || !channel) {
			await defer.edit({
				embeds: [NO_CHANNEL],
			});
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		if (isURL(query)) {
			await player.play(channel, query, {
				member: interaction.member as GuildMember,
				textChannel: interaction.channel as GuildTextBasedChannel,
			});
			await defer.delete();
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

			const msg = await defer.edit({
				embeds: [embed],
				components: [row],
			});

			const collector = msg.createMessageComponentCollector({
				componentType: ComponentType.StringSelect,
				time: 30_000,
			});

			collector.on("collect", async (i) => {
				const selection = i.values[0];
				const update = await i.update({
					embeds: [SELECT_OK],
					components: [],
				});
				await player.play(channel, selection, {
					member: i.member as GuildMember,
					textChannel: i.channel as GuildTextBasedChannel,
					message: i.message,
				});
				await update.delete();
			});
			collector.once("end", async (collected) => {
				if (collected.size > 0) return;
				await defer.edit({
					embeds: [SELECT_END],
					components: [],
				});
				setTimeout(async () => await defer.delete(), 4000);
			});
		}
	},
};
