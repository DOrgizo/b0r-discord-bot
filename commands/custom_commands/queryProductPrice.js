const sqlite3 = require('sqlite3')

module.exports = function queryProductPrice(msg, db) {

	let productInfo = msg.content.slice(18).trim().toUpperCase().split(/ +/)
	const arg = productInfo[productInfo.length - 1]
	const order = {LOW: 'ASC', HIGH: 'DESC'}
 
	if(arg === 'HIGH' || arg === 'LOW') {

		 db.all(`
			SELECT *
			FROM Product
			WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U") LIKE (?)
			OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U") LIKE (?)
			ORDER BY ProductPrice ${order[arg]}
			LIMIT 5
			`, `${productInfo.slice(0, productInfo.length - 1).join(' ')}%`, `%${productInfo.slice(0, productInfo.length - 1).join(' ')}%`, (err, rows) => {

				if(rows === undefined) return

				let result = rows.map(el => `${el.ProductName} Bs ${new Intl.NumberFormat('es-ES').format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`)

				if(result.length === 0) msg.channel.send(`\`\`no se mano\`\``)
				else msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	} else {

		 db.all(`
			SELECT *
			FROM Product ProductName
			WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U") LIKE (?)
			OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U") LIKE (?)
			LIMIT 5
			`, `${productInfo.join(' ')}%`, `%${productInfo.join(' ')}%`, (err, rows) => {

				if(rows === undefined) return

				let result = rows.map(el => `${el.ProductName} Bs ${new Intl.NumberFormat('es-ES').format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`)

				if(result.length === 0) msg.channel.send(`\`\`no se mano\`\``)
				else msg.channel.send(`\`\`${result.join('\n')}\`\``)

			})
	}

	db.close()
}