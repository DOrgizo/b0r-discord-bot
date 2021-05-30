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

const categorys = ['VIVERES/c/001', 'ALIMENTOS-FRESCOS/c/002', 'BEBIDAS/c/003', 'CUIDADO-PERSONAL/c/004', 'LIMPIEZA/c/005', 'HOGAR/c/006', 'MASCOTAS/c/007', 'OCASIÓN/c/008', 'CUIDADO-DE-LA-SALUD/c/011']

module.exports = async function excelsior(dolar) {

	let products = []

	for(const tag of categorys) {
		let bool = true
		let i = 0
		console.log(tag)

		try {

		while(bool === true) {
	
			let productName = []
			let prices = []

			try {
			
			const response = await got(`https://gamaenlinea.com/${tag}/?q=%3Arelevance&page=${i}`)
			const $ = cheerio.load(response.body)

			$('.product__list--name').each((i, product) => {
			productName.push($(product).text().trim())
			})

			$('.from-price-value').each((i, product) => {
			prices.push($(product).text().trim().slice(10).replace(/,/g, '.') * 1)
			})

			// SI productName[0] es igual a undefined entonces se sale del bucle y da por terminado el scraping
			// y SI es FALSO entonces seguira añadiendo productos al array de productos
			if(productName[0] == undefined || productName == '') bool = false
			else {
				const length = productName.length
				for(let j = 0; j < length; j++) {
				products.push(new Product(productName[j], (prices[j] * dolar).toFixed(2) * 1, prices[j]))
				console.log(products[products.length - 1])
				}
			}
		} catch(err) {}
			i++
		}
} catch(err){}

	}

	console.time("Excelsior Gama")
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
		array.push("Excelsior Gama")
	}

	let stmt = await db.prepare(sql)
	await stmt.run(array)
	stmt.finalize()
	

    db.close()

    console.timeEnd("Excelsior Gama")
	console.log(products.length)

}
