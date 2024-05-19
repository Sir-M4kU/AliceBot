import { client } from "./discord-client.js";
import { DISCORD_CLIENT_SECRET } from "./config.js";

await client.login(DISCORD_CLIENT_SECRET);
