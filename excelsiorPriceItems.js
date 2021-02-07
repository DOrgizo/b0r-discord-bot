const cheerio = require('cheerio')
const got = require('got')

module.exports = async function excelsiorPrices(message, msg) {
	const search = message.slice(18, message.length)

	try {
	const amount = 5
	let array = new Array(amount)
	let priceList = []

	console.log(`https://compraenlinea.excelsiorgama.com/search?q=${search}`)

	const response = await got(`https://compraenlinea.excelsiorgama.com/search?q=${search}`)

	const $ = cheerio.load(response.body)	

	// añadiendo precios al array priceList de esta forma xq soy mongolico
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
		if(array[i].name === undefined||array[i].price === undefined) continue
		priceList.push(`${array[i].name} ${array[i].price}`)
	}

	priceList = priceList.join('\n')

	if(priceList === '') msg.channel.send('``' + "no se mano" + '``') 
	else msg.channel.send('``' + priceList + '``')
	}

	catch(error) {
		console.log(error)
	}
}