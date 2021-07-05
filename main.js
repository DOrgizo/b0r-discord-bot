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
const ecuatorianos = ['https://i.ibb.co/NCSdHbF/ecuatorianos.png',
					  'https://i.ibb.co/xsD75YM/1af6b44e2d3327b0f207fee75ff76da4.png',
					  'https://i.ibb.co/r0bgTxf/760af5ce2386183dac773833dbef9e1e.png',
					  'https://i.ibb.co/fCttKf0/12107031-962867800400440-1270202484048346334-n.png',
					  'https://i.ibb.co/swxK6G8/11041440-938608769493010-975046102113841045-o.png',
					  'https://i.ibb.co/pPZ5PZM/O5-Hjst2d-400x400.png',
					  'https://i.ibb.co/7v6sfHg/54c9831e58cd236f35767be4cf187078.png',
					  'https://i.ibb.co/Php6xPb/Segundo-Castillo-Ecuadorv-Germanya35-S9-Dn-RXTnl.png',
					  'https://i.ibb.co/Kr4477Q/145912849-911711559600294-6344415858950538826-n.png',
					  'https://i.ibb.co/ng1r7SS/alex-qui-c3-b1-c3-b3nez-of-ecuador-celebrates-bronze-in-the-mens-200-news-photo-1625149934.png',
					  'https://i.ibb.co/ZxkvRQq/02a39428c4228009c5437a577180c387.png',
					  'https://i.ibb.co/N9X5g5R/298937.png',
					  'https://i.ibb.co/6HWX1ZS/raro-espa-C3-B1ol-ecuatorianos-2.png',
					  'https://i.ibb.co/x8tH9T2/Cuy-chactao-e1356283903577.png',
					  'https://i.ibb.co/zSZtxbM/pasillo-ecuatoriano.png',
					  'https://i.ibb.co/0JCTCRg/artworks-000156841156-1d5dyy-t500x500.png',
					  'https://i.ibb.co/YQPBFch/ecuatoriano-barcelona.png',
					  'https://i.ibb.co/QbFZBN0/1280px-Perez-flag-1.png',
					  'https://i.ibb.co/bLV81q8/UNICEF20en20-Ecuador.png',
					  'https://i.ibb.co/d4fHzkp/6-DCPECFEZJCUZE2-CPFXL4-CQY7-I.png',
					  'https://i.ibb.co/7GFrGr9/1.png',
					  'https://i.ibb.co/PxLRTwr/4207ebb9f5cce986ab4dd61c124c4153-xl.jpg',
					  'https://i.ibb.co/cLMcm3W/violador-vicentina.jpg',
					  'https://i.ibb.co/LzLLWFh/sam.jpg',
					  'https://i.ibb.co/XzzF5gw/argentina-ecuador-750px.jpg',
					  'https://i.ibb.co/PtfgPPW/f5b95525832f3712e665bb57dba370d3-XL.jpg',
					  'https://i.ibb.co/SRsMnhj/lucas-ocampos-argentina-vs-ecuador-eliminatorias-qatar-2022-jpg-1712792980.jpg',
					  'https://i.ibb.co/GF9RhYs/1055553335.jpg']

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
		else if(/zambo|zamba|veneco|veneca|:echaitopanlante:|:justoenlapatria:|:sheeeeeiitt:|:peruzuela:/gi.test(message.content) !== false && !message.author.bot) {
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
