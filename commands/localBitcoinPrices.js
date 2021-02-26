const fs = require('fs')	
const json = fs.readFileSync('./countrySymbols.json')
const countrySymbol = JSON.parse(json)
const fetch = require('node-fetch')

const limitador = value => {

	value = String(value).split('.')

  	return (value[1] == '00' ? value[0] : value.join('.')) * 1 
}

module.exports = {
	name: 'localbtc',
	description: "comando para ver el ultimo precio de la moneda seleccionada a dolar basado en el btc",
	async execute(msg, args) {
		const country = args[0]
		const urlPrices = `https://localbitcoins.com/bitcoincharts/${country}/trades.json`

		try {

			let usd = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
			usd = await usd.json()	

			const BTC = 1 / (usd.data.amount * 1)

			let priceInfo = await fetch(urlPrices)
			priceInfo = await priceInfo.json()

			const priceCoin = priceInfo[0].price * 1

			msg.channel.send(`\`\`${limitador(priceCoin * BTC).toFixed(2)} ${countrySymbol[country.toUpperCase()]}\`\``)
		} catch(error) {
			msg.channel.send("**Pon una divisa en formato ISO valido retrasado**")
		}
	}
}