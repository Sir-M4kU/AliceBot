const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];

fs.readdirSync('./commands/').forEach(dirs => {
	const commandFiles = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${dirs}/${file}`);
		commands.push(command.data.toJSON());
	}
});

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Recargando ${commands.length} (/) comandos.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Se han cargado exitosamente ${data.length} (/) comandos.`);
	}
	catch (error) {
		console.error(error);
	}
})();