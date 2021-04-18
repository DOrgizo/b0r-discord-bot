const sqlite3 = require('sqlite3')

module.exports = function queryProductPrice(msg, db) {

	msg.content = msg.content.toUpperCase()
	// NO HACER NUNCA
	const vowels = [['Á', 'A'], ['É', 'E'], ['Í', 'I'], ['Ó', 'O'], ['Ú', 'U']]

	for(vowel of vowels) {
		const letter = new RegExp(vowel[0], 'g')
		msg.content = msg.content.replace(letter, vowel[1])
	}
	// LO DE ARRIBA

	let productInfo = msg.content.trim().split(/ +/).slice(3)
	const arg = productInfo[productInfo.length - 1] // nombre de mierda, pensar en uno mejor por favor
	const order = {LOW: 'ASC', HIGH: 'DESC'}
 
	if(arg === 'HIGH' || arg === 'LOW') {

		// NO HACER NUNCA POR FAVOR
		 db.all(`
			SELECT * FROM Product
			WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U")
			LIKE CASE 
			WHEN (
					SELECT COUNT(ProductName) 
					FROM Product 
					WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U") LIKE (?)
				 ) > 0 
			THEN (?)
			ELSE (?) 
			END
			ORDER BY ProductPrice ${order[arg]}
			LIMIT 6
			`, `${productInfo.slice(0, productInfo.length - 1).join(' ')}%`, `${productInfo.slice(0, productInfo.length - 1).join(' ')}%`, `%${productInfo.slice(0, productInfo.length - 1).join(' ')}%`, (err, rows) => {

				if(rows === undefined) return

				let result = rows.map(el => `${el.ProductName} Bs ${new Intl.NumberFormat('es-ES').format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`)

				if(result.length === 0) {
					msg.channel.send(`\`\`no se mano\`\``)
					return
				}
				
				msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	} else {

		 db.all(`
			SELECT * FROM Product
			WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U")
			LIKE CASE 
			WHEN (
					SELECT COUNT(ProductName) 
					FROM Product 
					WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, "Á", "A"), "É", "E"), "Í", "I"), "Ó", "O"), "Ú", "U") 
					LIKE (?)
				 ) > 0 
			THEN (?)
			ELSE (?) 
			END
			LIMIT 6
			`, `${productInfo.join(' ')}%`, `${productInfo.join(' ')}%`, `%${productInfo.join(' ')}%`, (err, rows) => {

				if(rows === undefined) return

				let result = rows.map(el => `${el.ProductName} Bs ${new Intl.NumberFormat('es-ES').format(el.ProductPrice)} ${el.ProductDolarPrice}$ ${el.MarketName}`)

				if(result.length === 0) {
					msg.channel.send(`\`\`no se mano\`\``)
					return
				} 
				msg.channel.send(`\`\`${result.join('\n')}\`\``)

			})
	} 

	// NO HACER LO DE ARRIBA POR FAVOR

	db.close()
}