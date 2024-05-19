import { env } from "node:process";
import "dotenv/config";

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
	throw new Error("Missing environment variables");
}

export { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET };
