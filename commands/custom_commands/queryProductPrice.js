const sqlite3 = require('sqlite3')

module.exports = function queryProductPrice(msg, db) {

	msg.content = msg.content.toUpperCase()
	// NO HACER NUNCA
	const vowels = [['Á', 'A'], ['É', 'E'], ['Í', 'I'], ['Ó', 'O'], ['Ú', 'U']]
	// Para quitar acentos en el producto a buscar
	for(vowel of vowels) {
		const letter = new RegExp(vowel[0], 'g')
		msg.content = msg.content.replace(letter, vowel[1])
	}
	// LO DE ARRIBA

	let productInfo = msg.content.split(/ +/).slice(3)
	console.log(productInfo)
	// Constante que recibe el posible argumento
	const arg = productInfo[productInfo.length - 1] // nombre de mierda, pensar en uno mejor por favor
	const order = {LOW: 'ASC', HIGH: 'DESC'} // ORDER BY ASC|DESC
	// Columna ProductName formateada sin acentos (demasiado largo asi que lo pongo aqui por legibilidad)
	const productNameFormated = "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ProductName, \"Á\", \"A\"), \"É\", \"E\"), \"Í\", \"I\"), \"Ó\", \"O\"), \"Ú\", \"U\")"

	if(order[arg]) {
		const product = productInfo.slice(0, productInfo.length - 1).join(' ')
		// NO HACER NUNCA POR FAVOR
		console.log(product)
		 db.all(`
			SELECT * FROM Product
			WHERE ${productNameFormated} LIKE 
			CASE 
			WHEN (SELECT COUNT(ProductName) FROM Product WHERE ${productNameFormated} LIKE (?)) > 0 THEN (?)
			ELSE (?) END
			ORDER BY ProductPrice ${order[arg]}
			LIMIT 6
			`, `${product}%`, `${product}%`, `%${product}%`, (err, rows) => {
				// En el casi IMPOSIBLE caso de que la consulta se haga en el mismo momento en que se actualizen los precios
				if(err) return  

				const result = rows.map(el => `${el.ProductName} Bs ${new Intl.NumberFormat('es-ES').format(el.ProductPrice)} ${el.ProductDollarPrice}$ ${el.MarketName}`)

				if(result.length === 0) {
					msg.channel.send(`\`\`no se mano\`\``)
					return
				}
				
				msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	} else {

		const product = productInfo.join(' ')
		console.log(product)
		 db.all(`
			SELECT * FROM Product
			WHERE ${productNameFormated}
			LIKE 
			CASE 
			WHEN ( SELECT COUNT(ProductName) FROM Product WHERE ${productNameFormated} LIKE (?) ) > 0 THEN (?)
			ELSE (?) END
			LIMIT 6
			`, `${product}%`, `${product}%`, `%${product}%`, (err, rows) => {
				// En el casi IMPOSIBLE caso de que la consulta se haga en el mismo momento en que se actualizen los precios
				if(err) return

				const result = rows.map(el => `${el.ProductName} Bs ${new Intl.NumberFormat('es-ES').format(el.ProductPrice)} ${el.ProductDollarPrice}$ ${el.MarketName}`)

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