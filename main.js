// Dependencies
const fs = require('fs')
const Discord = require('discord.js')
const SetInterval = require('set-interval') 
const {token, prefix} = require('./config.json')
const sqlite3 = require('sqlite3')
const queryProductPrice = require('./commands/custom_commands/queryProductPrice')

// Variables
global.activeServers = {}
const client = new Discord.Client()
client.commands = new Discord.Collection
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}


client.on('ready', () => console.log(`Logged in as ${client.user.tag}`) )

client.on('message', message => {
	
	if(message.content.startsWith("b0r cuanto cuesta")){
		const db = new sqlite3.Database('./commands/custom_commands/scrapingPrices/db1.db')
		queryProductPrice(message, db)
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	if(!client.commands.get(commandName)) return

	const command = client.commands.get(commandName)

	try {
		command.execute(message, args)
	} catch(error) {
		console.log(error)
		message.reply("**¡Hubo un error en la ejecución del comando!**")
	}

})

client.login(token)
