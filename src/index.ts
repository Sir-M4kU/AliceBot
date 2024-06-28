import { bot } from "./bot.js";
import { DISCORD_CLIENT_SECRET } from "./config.js";

await bot.login(DISCORD_CLIENT_SECRET);
