const cheerio = require('cheerio')
const got = require('got')

module.exports = async function excelsiorPrices(msg) {
	const search = msg.content.slice(18)

	try {
	const amount = 5
	let array = new Array(amount)
	let priceList = []

	const response = await got(`https://compraenlinea.excelsiorgama.com/search?q=${search}`)

	const $ = cheerio.load(response.body)	

	// añadiendo precios al array priceList de esta forma xq soy mongolico
	for(let i = 0; i < amount; i++) {array[i] = {}}

	$('.product__list--name').each((i , element) => {
		if(i > amount - 1) return // si el indice es mayor al monto permitido de productos entonces retorna
		array[i].name = $(element).text().trim()
	})
	$('.from-price-value').each((i, element) => {
		if(i > amount - 1) return
		array[i].price = $(element).text().trim()
	})

	for(let i = 0; i < amount; i++) {
		if(array[i].name === undefined||array[i].price === undefined) continue // si el el nombre o el precio del producto es igual a undefined 
		priceList.push(`${array[i].name} ${array[i].price}`)                   // continua al siguiente loop
	}

	priceList = priceList.join('\n')

	if(priceList === '') msg.channel.send('``' + "no se mano" + '``') 
	else msg.channel.send(`\`\`${priceList}\`\``)
	}

	catch(error) {
		console.log(error)
		msg.reply("Hubo un error al tratar de conseguir el precio del producto")
	}
}