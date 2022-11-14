const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`¡Cargado!\nSe inicio como ${client.user.tag}`);
		client.user.setActivity('Escuchando Comandos', { type: ActivityType.Playing });
	},
};