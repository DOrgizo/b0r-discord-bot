const fetch = require('node-fetch')
const fs = require('fs')
const json = fs.readFileSync('./coinGeckoList.json')
const coinGeckoList = JSON.parse(json)  


module.exports = {
	name: 'price',
	description: "Coingecko API price cryptocurrency",
	async execute(msg, args) {

		try {
			const coin = args[0].toLowerCase()
			const data = await fetch(`https://api.coingecko.com/api/v3/coins/${coinGeckoList[coin]}`)
			const json = await data.json()

			const price =  json.market_data.current_price.usd
			let percentage = json.market_data.price_change_percentage_1h_in_currency.usd

			if(Math.sign(percentage) === 1) percentage = ('+' + Math.abs(percentage))

			msg.channel.send(`\`\`${price}$ ${percentage}%\`\``)

		} catch(error) { msg.channel.send(`\`\`No es una criptomoneda o la escribiste mal subnormal\`\``) }
	}
}