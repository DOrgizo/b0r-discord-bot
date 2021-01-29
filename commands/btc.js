const fetch = require('node-fetch')

module.exports = async function btc(message, msg) {

	const data = await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
	const json = await data.json()
	const price = json.data.amount * 1

	msg.channel.send('``' + price + '$' + '``')
}