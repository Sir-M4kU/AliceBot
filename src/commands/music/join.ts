import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type GuildMember,
} from "discord.js";
import { GuildIdResolvable } from "distube";
import { NO_CHANNEL } from "../../utils/embeds.js";

export default {
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join to the voice channel")
		.setDefaultMemberPermissions(1 << 5),
	async execute(interaction: ChatInputCommandInteraction) {
		const defer = await interaction.deferReply();
		const { voices: voiceManager } = interaction.client.distube;
		const {
			voice: { channel },
			guild,
		} = interaction.member as GuildMember;
		let voiceChannel = voiceManager.get(interaction.guild as GuildIdResolvable);

		if (guild.id !== interaction.guildId || !channel) {
			await defer.edit({ embeds: [NO_CHANNEL] });
			setTimeout(async () => await defer.delete(), 4000);
			return;
		}
		if (!voiceChannel) {
			voiceChannel = voiceManager.create(channel);
		}

		await voiceChannel.join(channel);
		await defer.delete();
	},
};
