const fetch = require('node-fetch')

module.exports = async function coinGecko(message, msg) {
	try {
		const coin = message.slice(7, message.length)
		const data = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`)
		const json = await data.json()

		const price =  json.market_data.current_price.usd * 1

		msg.channel.send('``' + price + '$' + '``')
	}

	catch(error) {
		msg.channel.send('``' + "no es una criptomoneda o la escribiste mal subnormal" + '``')
		console.log(error)
	}
}