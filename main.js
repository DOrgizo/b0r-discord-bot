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
const ecuatorianos = ['https://media.discordapp.net/attachments/861374809178112041/861375058614419466/5c3f9102b9dd7.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861375116699762698/5c98fb93e9180fed5b8b4567.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861375220714307634/6DCPECFEZJCUZE2CPFXL4CQY7I.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861375381721317436/UNICEF20en20Ecuador.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861375643799519252/ecuatoriano-barcelona.png?width=908&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861376014352646195/artworks-000156841156-1d5dyy-t500x500.png?width=454&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861376209887035392/docente-nino-ensena.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861376663287234620/1280px-Perez-flag-1.png?width=681&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861376782414381106/pasillo-ecuatoriano.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861376971832033339/Cuy_chactao-e1356283903577.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861377259552899132/298937.png?width=363&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861377381095702579/raro-espaC3B1ol-ecuatorianos-2.png?width=681&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861377454480424980/alex-qui-c3-b1-c3-b3nez-of-ecuador-celebrates-bronze-in-the-mens-200-news-photo-1625149934.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861378079091064842/5bcb5f68ad839.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861378461498605578/145912849_911711559600294_6344415858950538826_n.png?width=717&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861378879331368980/02a39428c4228009c5437a577180c387.png?width=366&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861378981697945620/SegundoCastilloEcuadorvGermanya35S9DnRXTnl.png?width=302&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861379144083832853/54c9831e58cd236f35767be4cf187078.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861379487136481280/O5Hjst2d_400x400.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861379631701164062/12107031_962867800400440_1270202484048346334_n.png?width=681&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861379939965468682/11041440_938608769493010_975046102113841045_o.png?width=605&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861380043220844584/11796451_921104774576743_1104758001169868215_n.png?width=605&height=454',
					  'https://media.discordapp.net/attachments/861374809178112041/861380105775480832/760af5ce2386183dac773833dbef9e1e.png',
					  'https://media.discordapp.net/attachments/861374809178112041/861380220724314162/1af6b44e2d3327b0f207fee75ff76da4.png']

for(const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

//const keyword = { cuesta: true, cuestan: true, vale: true, sale: true } // Para el comando "b0r cuanto cuesta|vale|sale"
const keyword = new Set(['cuesta', 'cuestan', 'vale', 'valen', 'sale', 'salen'])


client.on('ready', () => console.log(`Logged in as ${client.user.tag}`) )

client.on('message', message => {
	
	if(message.content.startsWith("b0r cuanto")) {
		const msg = message.content.trim().split(/ +/)

		const test = msg[2] // nombre temporal hasta que piense en algo mejor o no haga 1 codigo de mierda como este

		if(!keyword.has(test) || msg.length < 4) return
		// ya no necesito declarar la base de datos aqui pero soy retardado y me da flojera acomomodarlo
		const db = new sqlite3.Database('./commands/custom_commands/scrapingPrices/db1.db')

		queryProductPrice(message, db)
		
	}	else if(/colomb|colombia/gi.test(message.content) !== false && !message.author.bot) message.channel.send("malditos **colombianos**")
		else if(/zambo|zamba|veneco|veneca/gi.test(message.content) !== false && !message.author.bot) {
			const rand = Math.floor(Math.random() * ecuatorianos.length)
			message.channel.send(ecuatorianos[rand])
		}
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
