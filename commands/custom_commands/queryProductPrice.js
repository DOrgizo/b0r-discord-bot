const sqlite3 = require('sqlite3')

module.exports = function queryProductPrice(msg, db) {

	let productConf = msg.content.slice(18).trim().toUpperCase().split(/ +/)
	let result = undefined
	const arg = productConf[productConf.length - 1]
	const order = {LOW: 'ASC', HIGH: 'DESC'}
 
	if(arg === 'HIGH' || arg === 'LOW') {
		 db.all(`
			SELECT *
			FROM Product
			WHERE ProductName LIKE "${productConf.slice(0, productConf.length - 1).join(' ')}%"
			ORDER BY ProductPrice ${order[arg]}
			LIMIT 5
			`, (err, rows) => {
				result = rows.map(el => {
					return `${el.ProductName} Bs.S ${el.ProductPrice} ${el.ProductDolarPrice}$ ${el.MarketName}`
				})
				if(result.length === 0) msg.channel.send(`\`\`no se mano\`\``)
				else msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	} else {

		 db.all(`
			SELECT *
			FROM Product
			WHERE ProductName LIKE "${productConf.join(' ')}%"
			LIMIT 5
			`, (err, rows) => {
				result = rows.map(el => {
					return `${el.ProductName} Bs.S ${el.ProductPrice} ${el.ProductDolarPrice}$ ${el.MarketName}`
				})
				 if(result.length === 0) msg.channel.send(`\`\`no se mano\`\``)
				 else msg.channel.send(`\`\`${result.join('\n')}\`\``)
			})
	}

	db.close()
}