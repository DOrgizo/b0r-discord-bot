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

module.exports = async function caraota(dolar) {

	let products = []
	let prices = []
	let item = []
	const url = 'https://caraotamarket.com/3-tienda'
	
	try {
		const response = await got(url)
		const $ = cheerio.load(response.body)

		$('.product-title').each((i, product) => {
			products.push($(product).text().trim())
		})

		$('.price').each((i, price) => {
			prices.push($(price).text().trim().slice(1).replace(/,/g, '.') * 1)
		})

		for(let i = 0; i < products.length; i++) {
			item.push(new Product(products[i], (prices[i] * dolar).toFixed() * 1, prices[i]))
			console.log(item[i], i)
		}

		console.time("Caraota Market")

		const db = await sqlite.open({
			filename: './db1.db',
			driver: sqlite3.Database
		})
 
        for(let i = 0; i < item.length; i++) {
            const stmt = await db.prepare("REPLACE INTO Product VALUES (?, ?, ?, ?)")
            stmt.run(item[i].product, item[i].price, item[i].dolarPrice, "Caraota Market")
            stmt.finalize()
        }   
       db.close()

       console.timeEnd("Caraota Market")

	} catch(error) {
		throw error
	}
}
