const fetch = require('node-fetch')
const limitador = value => {

	value = String(value).split('.')

  	return (value[1] == '00' ? value[0] : value.join('.')) * 1 
}

module.exports = async function dolartoday(msg) {

	const data = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
	const dolar = await data.json()

		msg.channel.send('``' + limitador(dolar.USD.dolartoday) + ' Bs.S' + '``')
}