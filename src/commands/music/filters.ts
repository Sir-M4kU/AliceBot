import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import { type Queue, type GuildIdResolvable } from "distube";
import { validate } from "../../utils/utils.js";
import {
	CLEAR_FILTERS,
	FILTER_ADDED,
	FILTER_REMOVED,
} from "../../utils/embeds.js";

const FILTERS: { name: string; value: string }[] = [
	{
		name: "Disable",
		value: "disable",
	},
	{
		name: "Nightcore",
		value: "nightcore",
	},
	{
		name: "Bass Boosted",
		value: "bassboost",
	},
];

export default {
	data: new SlashCommandBuilder()
		.setName("filters")
		.setDescription("Set filters to the queue")
		.addStringOption((option) =>
			option
				.setName("options")
				.setDescription("Set an option for the filter")
				.addChoices(...FILTERS)
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const option = interaction.options.getString("options") ?? "";
		const queue = interaction.client.distube.getQueue(
			interaction.guild as GuildIdResolvable,
		) as Queue;
		const { invalid, message } = validate(interaction);

		if (invalid) {
			await defer.edit(message);
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}

		if (option === FILTERS[0].value) {
			queue.filters.clear();
			await defer.edit({ embeds: [CLEAR_FILTERS] });
		} else if (queue.filters.has(option)) {
			queue.filters.remove(option);
			await defer.edit({ embeds: [FILTER_REMOVED(option)] });
		} else {
			queue.filters.add(option);
			await defer.edit({ embeds: [FILTER_ADDED(option)] });
		}

		setTimeout(async () => await defer.delete(), 4000);
	},
};
