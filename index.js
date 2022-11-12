const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Crea la instancia de "client"
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once(Events.ClientReady, c => {
    console.log(`¡Cargado!\nSe inicio como ${c.user.tag}`);
});

bot.login(token);