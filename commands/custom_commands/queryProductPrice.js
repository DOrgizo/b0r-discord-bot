const sqlite3 = require('sqlite3')

module.exports = function queryProductPrice(msg, db) {

	let productInfo = msg.content.slice(18).trim().toUpperCase().split(/ +/)
	const arg = productInfo[productInfo.length - 1]
	const order = {LOW: 'ASC', HIGH: 'DESC'}
 
	if(arg === 'HIGH' || arg === 'LOW') {
		 db.all(`
			SELECT *
			FROM Product
			WHERE ProductName LIKE "${productInfo.slice(0, productInfo.length - 1).join(' ')}%"
			ORDER BY ProductPrice ${order[arg]}
			LIMIT 5
			`, (err, rows) => {
				const result = rows.map(el => {
					return `${el.ProductName} Bs ${new Intl.NumberFormat().format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`
				})
				if(result.length === 0) {
					db.all(`
						SELECT * 
						FROM Product
						WHERE ProductName LIKE "%${productInfo.slice(0, productInfo.length - 1).join(' ')}%"
						ORDER BY ProductPrice ${order[arg]}
						LIMIT 5
						`, (err, rows) => {
							const result = rows.map(el => {
								return `${el.ProductName} Bs ${new Intl.NumberFormat().format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`
							})

							if(result.length === 0) msg.channel.send(`\`\`no se mano\`\``) 
							else msg.channel.send(`\`\`${result.join('\n')}\`\``)

						})
				}
				else msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	} else {

		 db.all(`
			SELECT *
			FROM Product
			WHERE ProductName LIKE "${productInfo.join(' ')}%"
			LIMIT 5
			`, (err, rows) => {
				let result = rows.map(el => {
					return `${el.ProductName} Bs ${new Intl.NumberFormat().format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`
				})
				 if(result.length === 0) {
				 	db.all(`
				 		SELECT *
				 		FROM Product
				 		WHERE ProductName LIKE "%${productInfo.join(' ')}%"
				 		LIMIT 5
				 		`, (err, rows) => {
				 			result = rows.map(el => {
				 				return `${el.ProductName} Bs ${new Intl.NumberFormat().format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`
				 			})

				 			if(result.length === 0) msg.channel.send(`\`\`no se mano\`\``) 
				 			else msg.channel.send(`\`\`${result.join('\n')}\`\``)
				 				
				 		})
				 }

				 else msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	}

	db.close()
}