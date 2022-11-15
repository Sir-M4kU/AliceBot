const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const { Player } = require('discord-player');

// Crea la instancia de "client"
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

// Carga las funciones de musica
const player = new Player(client, {
	leaveOnEnd: false,
	leaveOnEmpty: false,
});
client.player = player;

// Path a los Eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const eventsFilePath = path.join(eventsPath, file);
	const event = require(eventsFilePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Path a los Eventos/Player
const playerPath = path.join(__dirname, 'events/player');
const playerFiles = fs.readdirSync(playerPath).filter(file => file.endsWith('.js'));

for (const file of playerFiles) {
	const playerFilePath = path.join(playerPath, file);
	const playerEvent = require(playerFilePath);
	client.player.on(playerEvent.name, async (...args) => playerEvent.execute(...args, client));
}

client.commands = new Collection();

// Path a los comandos
fs.readdirSync('./commands').forEach(dirs => {
	const commandFiles = fs.readdirSync(`./commands/${dirs}`).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${dirs}/${file}`);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[ATENCION!]\nEl comando ${command} no tiene asignado un valor 'data' o 'execute'.`);
		}
	}
});

client.login(token);