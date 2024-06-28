import { SlashCommandBuilder } from "discord.js";

import type { Command } from "../../types.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The song to play")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.reply("Not implemented");
  }
} as Command;
