const got = require('got')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const sqlite3 = require('sqlite3')

class Product{
	constructor(product, price, dolarPrice) {
		this.product = product
		this.price = price
		this.dolarPrice = dolarPrice
	}
}

module.exports = async function caraota() {

	let dolarPrice = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
	dolarPrice = await dolarPrice.json()

	let products = []
	let prices = []
	let item = []
	const url = 'https://caraotamarket.com/2-todos-los-productos'
	
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
			item.push(new Product(products[i], (prices[i] * dolarPrice.USD.promedio_real).toFixed(2) * 1, prices[i]))
		}

			let db = new sqlite3.Database('./db1.db')
 
         for(let i = 0; i < item.length; i++) {
            let stmt = db.prepare(`REPLACE INTO Product VALUES ((?), (?), (?), (?))`)
            stmt.run([item[i].product, item[i].price, item[i].dolarPrice, "Caraota Market"])
            stmt.finalize()
        }   
        db.close()

	} catch(error) {
		throw error
	}
}
