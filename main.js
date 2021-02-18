// Dependencies
const discord = require('discord.js')
const SetInterval = require('set-interval') 
const coinGecko = require('./commands/coinGecko')
const dolartoday = require('./commands/dolartoday')
const expressionEvaluator = require('./commands/expressionEvaluator')
const excelsiorPrices = require('./commands/excelsiorPriceItems')
const localBitcoinPrices = require('./commands/localBitcoinPrices')
const diceRoll = require('./commands/diceRoll')
const lectormanga = require('./commands/lectormanga')
const {token, version, prefix} = require('./config.json')

// Variables
const client = new discord.Client()
const nanoneId = '384795486961401867'
const commandsHelp = `
COMANDOS DEL BOT: 

Atención los comandos van sin corchetes SIN CORCHETES
SIN CORCHETES
SIN C O R C H E T E S

$help
$version
$price [criptomoneda]
$calc [expresión]
$calc help
$localbtc [moneda en formato ISO]
$dice [caras del dado] [cantidad de dados]
$dolartoday 
b0r cuanto cuesta [producto]
`

client.on('ready', () => console.log(`Logged in as ${client.user.tag}`) )

client.on('message', msg => {
	const message =  msg.content

	// help command
	if(message === prefix + 'help') msg.channel.send('```' + commandsHelp + '```')

	// b0r cuanto cuesta [product] command
	else if(message.startsWith("b0r cuanto cuesta")) excelsiorPrices(message, msg)

	// eval math command	
	else if(message.startsWith(prefix + 'calc')) expressionEvaluator(message, msg)

	// localbitcoin command
	else if(message.startsWith(prefix + 'localbtc')) localBitcoinPrices(message, msg)

	// coingecko command
	else if(message.startsWith(prefix + 'price')) coinGecko(message, msg)

	// dice roll command
	else if(message.startsWith(prefix + 'dice')) diceRoll(message, msg)

	// dolartoday price command
	else if(message === prefix + 'dolartoday') dolartoday(msg)
	
	// bot version command
	else if(message === prefix + 'version') msg.channel.send('``' + version + '``')

	else if(msg.author.id === nanoneId && message === prefix + 'wake up') lectormanga(msg)

	else if(msg.author.id === nanoneId && message === prefix + 'sweet dreams') {
		msg.channel.send(':pleading_face:')
		SetInterval.clear(msg.channel.id)
	}
})

client.login(token)
