const { Client, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('node:fs')
const { DisTube } = require('distube')
const path = require('node:path')
const dotenv = require('dotenv')
const deployCommands = require('./deployCommands')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
})

client.distube = new DisTube(client, {
  leaveOnEmpty: false,
  leaveOnStop: false,
  ytdlOptions: {
    highWaterMark: 1 << 30,
    quality: 'highest'
  }
})

dotenv.config()
client.commands = new Collection()

console.log('Cargando los eventos del DisTube...')

const playerPath = path.join(__dirname, 'events/player')
const playerFiles = fs.readdirSync(playerPath).filter(file => file.endsWith('.js'))

for (const file of playerFiles) {
  const filePath = path.join(playerPath, file)
  const event = require(filePath)

  client.distube.on(event.name, (...args) => event.execute(...args))
}

console.log('Cargando los eventos del Bot...')

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath);

  (event.once) ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args))
}

console.log('Cargando los comandos...')

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`[WARNING]\nEl comando en ${filePath} no tiene ningun "data" o una propiedad "execute".`)
  }
}

deployCommands()

client.login(process.env.TOKEN)
