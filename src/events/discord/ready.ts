import type { DiscordEvent } from "../../types.js";

export default {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user?.tag}!`);
  }
} as DiscordEvent<"ready">;
