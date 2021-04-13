const got = require('got')
const cheerio = require('cheerio')
const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const fs = require('fs')

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
			console.log()
			prices.push($(price).text().trim().slice(1).replace(/,/g, '.') * 1)
		})

		for(let i = 0; i < products.length; i++) {
			item.push(new Product(products[i], (prices[i] * dolar).toFixed() * 1, prices[i]))
			console.log(item[i], i)
		}

	} catch(error) {
		throw error
	}

	console.time("Caraota Market")
	const db = await sqlite.open({
		filename: './db1.db',
		driver: sqlite3.Database
	})

	const length = item.length
	const query = products.map(el => "((?), (?), (?), (?))").join(',')
	const sql = `REPLACE INTO Product
		 		 VALUES ${query}`
	let array = []

	for(let i = 0; i < length; i++) {
		array.push(item[i].product)
		array.push(item[i].price)
		array.push(item[i].dolarPrice)
		array.push("Caraota Market")
	}

	let stmt = await db.prepare(sql)
	await stmt.run(array)
	stmt.finalize()
        
	db.close()

    console.log(item.length)
    console.timeEnd("Caraota Market")
}
