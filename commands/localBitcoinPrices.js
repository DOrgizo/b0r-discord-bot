const fs = require('fs')	
const json = fs.readFileSync('./countrySymbols.json')
const countrySymbol = JSON.parse(json)
const fetch = require('node-fetch')

const limitador = value => {

	value = String(value).split('.')

  	return (value[1] == '00' ? value[0] : value.join('.')) * 1 
}


module.exports = async function localBitcoinPrices(message, msg) {
	const country = message.slice(10, message.length).toLowerCase()	
	const urlPrices = `https://localbitcoins.com/bitcoincharts/${country}/trades.json`

	let usd = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
	usd = await usd.json()	

	const BTC = 1 / (usd.data.amount * 1)

	fetch(urlPrices)
	.then(res => res.json())
	.then(data => {

		let priceBTC = data[0].price * 1

		msg.channel.send("``" + limitador((priceBTC * BTC).toFixed(2)) + ' ' + countrySymbol[country.toUpperCase()] + "``")
	})

	.catch(err => msg.channel.send("pon una moneda en formato ISO valido retrasado"))
}