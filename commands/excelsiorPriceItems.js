const cheerio = require('cheerio')
const request = require('request-promise')

module.exports = async function excelsiorPrices(message, msg) {
	const search = message.slice(17, message.length)

	try {
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