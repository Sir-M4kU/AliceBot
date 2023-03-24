const { REST, Routes } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('node:fs')
const path = require('node:path')

const commands = []

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  commands.push(command.data.toJSON())
}

dotenv.config()
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

const deployCommands = async () => {
  try {
    console.log(`Cargando ${commands.length} comandos.`)

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    )
  } catch (err) {
    console.error('Ups... Ha ocurrido un error', err)
  }
}
module.exports = deployCommands
