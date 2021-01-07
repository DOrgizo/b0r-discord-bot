const discord = require('discord.js')
const mexp = require('math-expression-evaluator')
const fetch = require('node-fetch')
const fs = require('fs')
const json = fs.readFileSync('./countrySymbols.json')

const countrySymbol = JSON.parse(json)






// variables
const client = new discord.Client()
const secretToken =  // discord token app here 

const commandsHelp = `
COMANDOS DEL BOT: 

Atención los comandos van sin corchetes SIN CORCHETES
SIN CORCHETES
SIN C O R C H E T E S

$help
$shauna (comando inutil)
$nanone (comando inutil)
$calc [expresión]
$calc help
$localbtc [moneda en formato ISO]
$dice [caras del dado] [cantidad de dados]
$dolartoday 
b0r cuanto cuesta [producto]
`
const calcHelp = `
    Supported Maths Symbols
	+       Addition Operator eg. 2+3 results 5
	-       Subtraction Operator eg. 2-3 results -1
	/       Division operator eg 3/2 results 1.5 
	*       Multiplication Operator eg. 23 results 6
	Mod     Modulus Operator eg. 3 Mod 2 results 1
	(       Opening Parenthesis
	)       Closing Parenthesis
	Sigma   Summation eg. Sigma(1,100,n) results 5050
	Pi      Product eg. Pi(1,10,n) results 3628800
	n       Variable for Summation or Product
	pi      Math constant pi returns 3.14
	e       Math constant e returns 2.71
	C       Combination operator eg. 4C2 returns 6
	P       Permutation operator eg. 4P2 returns 12
	!       factorial operator eg. 4! returns 24
	log     logarithmic function with base 10 eg. log 1000 returns 3
	ln      natural log function with base e eg. ln 2 returns .3010 
	pow     power function with two operator pow(2,3) returns 8
	^       power operator eg. 2^3 returns 8
	root    underroot function root 4 returns 2 `	


	
	
	
const limitador = value => {
	
 	value = String(value).split('.')

  	return (value[1] == '00' ? value[0] : value.join('.')) * 1 
}

async function costItem(search, msg, error) { // por arreglar
	try {
	const cheerio = require('cheerio')
	const request = require('request-promise')

	const amount = 5
	let array = new Array(amount)
	let string = ''

	const $ = await request({
		uri: `https://compraenlinea.excelsiorgama.com/search?q=${search}`,
		transform: body => cheerio.load(body)
	})

	

	for(let i = 0; i < amount; i++) {array[i] = {}}

	$('.product__list--name').each((i , element) => {
		if(i > amount - 1) return
		array[i].name = $(element).text()
	})
	$('.from-price-value').each((i, element) => {
		if(i > amount - 1) return
		array[i].price = $(element).text()
	})

	for(let i = 0; i < amount; i++) {
		string += `${array[i].name} ${array[i].price}\n`
	}

	msg.channel.send('``' + string.slice(0, string.length - 2) + '``')}
	catch(e) {msg.channel.send('``' + error + '``')}
}

async function localBtc(usdCoinbase, urlVe, msg, symbol, country) {
	let usd = await fetch(usdCoinbase)

	usd = await usd.json()	

	const BTC = 1 / (usd.data.amount * 1)

	fetch(urlVe)
	.then(res => res.json())
	.then(data => {
		let priceBTC = (data[0].price / 50)

		//data.forEach(element => {priceBTC += element.price * 1})
		//for(let i = 0; i < 50; i++)	{priceBTC += data[i].price * 1}

		//priceBTC /= 50
		msg.channel.send("``" + limitador((priceBTC * BTC).toFixed(2)) + ' ' + countrySymbol[country.toUpperCase()] + "``")
	})
		.catch(err => msg.channel.send("pon una moneda en formato ISO valido retrasado"))
}


client.on('ready', () => console.log(`Logged in as ${client.user.tag}`) )

client.on('message', msg => {
	const mensaje =  msg.content
	
	// eval math command
	if(mensaje.slice(0, 5) === '$calc') {
		
		if(mensaje.slice(5, 10) === ' help') {
			msg.channel.send('```' + messageHelp + '```')
		}else {
			const calc = mensaje.slice(5, mensaje.length)
			let result = undefined
		
			try {result = mexp.eval(calc)}

			catch(e) {result = "``SYNTAX ERROR``"}

			msg.channel.send('``' + result + '``')
		}
	}
	
	// localbitcoin command
	else if(mensaje.slice(0, 9) === '$localbtc') {
		const country = mensaje.slice(10, mensaje.length).toLowerCase()
			
		//const urlUsd = 'https://localbitcoins.com/bitcoincharts/usd/trades.json'
		const usdCoinbase = 'https://api.coinbase.com/v2/prices/spot?currency=USD'	
		const urlVe = `https://localbitcoins.com/bitcoincharts/${country}/trades.json`
 
		localBtc(usdCoinbase, urlVe, msg, countrySymbol, country)
	}

	// dice role command
	else if(mensaje.slice(0,5) === '$dice') {
		const [diceFaces, numDices] = mensaje.slice(6).split(' ')
		let array = []

		if(diceFaces > 50) {msg.channel.send("no vas a lanzar una maldita mierda mayor a 50")}
		else if(numDices > 30) {msg.channel.send("no vas a lanzar mas de 30 dados a la vez desgraciado")}
		else {
			for(let i = 0; i < numDices; i++) {
				array.push(Math.floor(Math.random() * ((parseInt(diceFaces) + 1) - 1) + 1 ))
			}

			// esto de aqui es para que se vea como un array con corchetes y espacios
			msg.channel.send('``[' + array.join(", ") + ']``') 
		}
	}

	// dolartoday price command

	else if(mensaje.slice(0, 11) === '$dolartoday') {
		(async () => {
			const data = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
			const dolar = await data.json()

			msg.channel.send('``' + limitador(dolar.USD.dolartoday) + ' Bs.S' + '``')
		})()
	}

	// b0r cuanto cuesta [product] command
	else if(mensaje.slice(0, 17) === 'b0r cuanto cuesta') {

		if(mensaje.slice(17).length < 1) {return msg.channel.send("pon un producto subnormal")}
		const error = `si ocurrio un error intenta otra vez
					   si tu producto no existe deja de estar tocandome los huevos`
		const search = mensaje.slice(17)
		costItem(search, msg, error)
	}
})

client.login(secretToken)