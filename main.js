// Dependencies
const discord = require('discord.js')
const btc = require('./commands/btc')
const dolartoday = require('./commands/dolartoday')
const expressionEvaluator = require('./commands/expressionEvaluator')
const excelsiorPrices = require('./commands/excelsiorPriceItems')
const localBitcoinPrices = require('./commands/localBitcoinPrices')
const diceRoll = require('./commands/diceRoll')


// Variables
const client = new discord.Client()
const version = 'v1.5'
const secretToken = ''

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
	if(message === '$help') msg.channel.send('```' + commandsHelp + '```')

	// bot version command
	else if(message === '$version') msg.channel.send(version)

	// coinbase coin price command
	else if(message.startsWith('$btc')) btc(message, msg)

	// eval math command	
	else if(message.startsWith('$calc')) expressionEvaluator(message, msg)

	// localbitcoin command
	else if(message.startsWith('$localbtc')) localBitcoinPrices(message, msg)

	// dice roll command
	else if(message.startsWith('$dice')) diceRoll(message, msg)

	// dolartoday price command
	else if(message.startsWith('$dolartoday')) dolartoday(msg)

	// b0r cuanto cuesta [product] command
	else if(message.startsWith("b0r cuanto cuesta")) excelsiorPrices(message, msg)
})

client.login(secretToken)
