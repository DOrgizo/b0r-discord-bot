const got = require('got')
const cheerio = require('cheerio')
const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')


class Product{
	constructor(product, price, dolarPrice) {
		this.product = product
		this.price = price
		this.dolarPrice = dolarPrice
	}
}


module.exports = async function elplazas(dolar) {

	let products = []
	let i = 1
	let bool = true

	while(bool === true) {

		let productName = []
		let prices = []

		try {

			const response = await got(`https://www.elplazas.com/Products.php?Page=${i}`)
			const $ = cheerio.load(response.body)

			$('.Moneda').remove()

			$('.Description').each((i, product) => {
				productName.push($(product).text().trim())
			})

			$('.Price').children('p').remove()

			$('.Price').each((i, product) => {
				prices.push($(product).text().trim().replace(/,/g, '').replace(/[(E)]/g, '') * 1)
			})

			if(productName[0] == undefined || productName == '') bool = false
			else {

				const length = productName.length

				for(let i = 0; i < length; i++) {
					products.push(new Product(productName[i], prices[i], (prices[i] / dolar).toFixed(2)))
				}
				i++
			}

			console.log(products.length)
		} catch(err) {}

	}

	console.time("El Plazas")
	const db = await sqlite.open({
			filename: './db1.db',
			driver: sqlite3.Database
		})

	const length = products.length
	const query = products.map(el => "((?), (?), (?), (?))").join(',')
	const sql = `REPLACE INTO Product
			 VALUES ${query}`
	let array = []

	for(let i = 0; i < length; i++) {
		array.push(products[i].product)
		array.push(products[i].price)
		array.push(products[i].dolarPrice)
		array.push("El Plazas")
	}

	let stmt = await db.prepare(sql)
	await stmt.run(array)
	stmt.finalize()
            
    db.close()

    console.timeEnd("El Plazas")
	console.log(products.length)
}