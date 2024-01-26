import { Events, type Interaction, type CacheType } from "discord.js";

export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction<CacheType>) {
		const isChatInputCommand = interaction.isChatInputCommand();

		if (isChatInputCommand) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.log(`No command matching ${interaction.commandName} was found`);
				return;
			}
			try {
				await command.execute(interaction);
			} catch (e) {
				console.log(e);
				const content = "There was an error while executing this command!";
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content, ephemeral: true });
				} else {
					await interaction.reply({ content, ephemeral: true });
				}
			}
		}
	},
};
