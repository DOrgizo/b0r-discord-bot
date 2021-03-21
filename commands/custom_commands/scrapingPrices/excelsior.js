const got = require('got')
const cheerio = require('cheerio')
const sqlite3 = require('sqlite3').verbose()
const fetch = require('node-fetch')
const fs = require('fs')

class Product{
	constructor(product, price, dolarPrice) {
		this.product = product
		this.price = price
		this.dolarPrice = dolarPrice
	}
}

const tags = ['VIVERES/c/001', 'ALIMENTOS-FRESCOS/c/002', 'BEBIDAS/c/003', 'CUIDADO-PERSONAL/c/004', 'LIMPIEZA/c/005', 'HOGAR/c/006', 'MASCOTAS/c/007', 'OCASIÓN/c/008', 'CUIDADO-DE-LA-SALUD/c/011']

module.exports = async function excelsior() {

	let dolarPrice = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
	dolarPrice = await dolarPrice.json()
	let products = []

	for(const tag of tags) {
		let bool = true
		let i = 0
		console.log(tag)

		try {

		while(bool === true) {
	
			let productName = []
			let prices = []
			

			const response = await got(`https://compraenlinea.excelsiorgama.com/${tag}/?q=%3Arelevance&page=${i}`)
			const $ = cheerio.load(response.body)

			$('.product__list--name').each((i, product) => {
			productName.push($(product).text().trim())
			})

			$('.from-price-value').each((i, product) => {
			prices.push($(product).text().trim().slice(10).replace(/,/g, '.') * 1)
			})


			if(productName[0] == undefined || productName == '') bool = false
			else {
				for(let j = 0; j < productName.length; j++) {
				products.push(new Product(productName[j], (prices[j] * dolarPrice.USD.promedio_real).toFixed(2) * 1, prices[j]))
				console.log(products)
				}
			}
			i++
		}
} catch(err){}

	}

	let db = new sqlite3.Database('./db1.db')
 
         for(let i = 0; i < products.length; i++) {
            let stmt = db.prepare(`REPLACE INTO Product VALUES ((?), (?), (?), (?))`)
            stmt.run([products[i].product, products[i].price, products[i].dolarPrice, "Excelsior Gama"])
            stmt.finalize()
        }   
        db.close()
	console.log(products.length)

}
