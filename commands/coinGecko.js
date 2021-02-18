const fetch = require('node-fetch')
const fs = require('fs')
const json = fs.readFileSync('./coinGeckoList.json')
const coinGeckoList = JSON.parse(json)  


module.exports = async function coinGecko(message, msg) {
	
	try {
		const coin = message.slice(7, message.length)
		const data = await fetch(`https://api.coingecko.com/api/v3/coins/${coinGeckoList[coin]}`)
		const json = await data.json()

		const price =  json.market_data.current_price.usd * 1
		let percentage = json.market_data.price_change_percentage_1h_in_currency.usd * 1

		if(Math.sign(percentage) === 1) percentage = ('+' + Math.abs(percentage)) * 1

		msg.channel.send('``' + price + '$' + ' ' + percentage + '%' + '``')
	}

	catch(error) {
		msg.channel.send('``' + "no es una criptomoneda o la escribiste mal subnormal" + '``')
	}
}