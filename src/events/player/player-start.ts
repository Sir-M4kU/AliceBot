import type { PlayerEvent } from "../../types.js";

export default {
  name: "playerStart",
  isPlayer: true,

  async execute(queue, track) {
    await queue.metadata.channel.send(`Now playing: **${track.title}**`);
  }
} as PlayerEvent<"playerStart">;
