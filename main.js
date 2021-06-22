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

//const keyword = { cuesta: true, cuestan: true, vale: true, sale: true } // Para el comando "b0r cuanto cuesta|vale|sale"
const keyword = new Set(['cuesta', 'cuestan', 'vale', 'valen', 'sale', 'salen'])


client.on('ready', () => {
	const TIME = 4.32e+7 // 12 horas
	console.log(`Logged in as ${client.user.tag}`)

	client.channels.fetch('809483097401196558')
    .then(channel => {
        setInterval( () => channel.send(`no aguanto la pela: 
        	**BTC**: \`\`3QWUrX26z2itUUCydbN3tKeW9FLq2bEQCR\`\`
        	**ICX**: \`\`hxbb9f109b1427c44e9f50668c8fb54bbcfedb866e\`\`
        	`), TIME) 
    })
} )

client.on('message', message => {
	
	if(message.content.startsWith("b0r cuanto")) {
		const msg = message.content.trim().split(/ +/)

		const test = msg[2] // nombre temporal hasta que piense en algo mejor o no haga 1 codigo de mierda como este

		if(!keyword.has(test) || msg.length < 4) return
		// ya no necesito declarar la base de datos aqui pero soy retardado y me da flojera acomomodarlo
		const db = new sqlite3.Database('./commands/custom_commands/scrapingPrices/db1.db')

		queryProductPrice(message, db)
		
	}	else if(/colomb|colombia/gi.test(message.content) !== false && !message.author.bot) message.channel.send("malditos **colombianos**")
		else if (!message.content.startsWith(prefix) || message.author.bot) return

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
