import type { DiscordEvent } from "../../types.js";
import { commands } from "../../utils.js";

export default {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);

        if (
          (interaction.replied || interaction.deferred) &&
          interaction.ephemeral
        ) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
          });
        }
      }
    }
  }
} as DiscordEvent<"interactionCreate">;
